using FluentMigrator.Runner;
using FluentMigrator.Runner.Processors;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

public static class MigratorExtensions
{
    public static IServiceCollection AddBifrostMigrations(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("ConnectionString 'DefaultConnection' não configurada.");

        services.Configure<MigrationOptions>(options =>
        {
            configuration.GetSection("Migrations").Bind(options);

            if (!configuration.GetSection("Migrations").Exists())
            {
                options.RunOnStartup = true;
            }
        });

        services.Configure<FluentMigrator.Runner.Initialization.RunnerOptions>(runnerOptions =>
        {
            var tags = configuration.GetSection("Migrations:Tags").Get<string[]>();
            if (tags is { Length: > 0 })
                runnerOptions.Tags = tags;
        });

        // FluentMigrator 6.x: algumas dependências do runner resolvem ProcessorOptions diretamente.
        // Em alguns hosts isso não vem registrado automaticamente, então registramos aqui.
        services.AddOptions<ProcessorOptions>();
        services.AddScoped(sp => sp.GetRequiredService<IOptionsSnapshot<ProcessorOptions>>().Value);

        services
            .AddFluentMigratorCore()
            .ConfigureRunner(rb =>
            {
                rb.AddPostgres()
                    .WithGlobalConnectionString(connectionString)
                    .ScanIn(typeof(MigrationAssemblyMarker).Assembly).For.Migrations();
            })
            .AddLogging(lb => lb.AddFluentMigratorConsole());

        return services;
    }

    public static async Task RunBifrostMigrationsAsync(this IHost host, CancellationToken cancellationToken = default)
    {
        using var scope = host.Services.CreateScope();

        var options = scope.ServiceProvider.GetRequiredService<IOptions<MigrationOptions>>().Value;
        var environment = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("FluentMigrator");

        if (!options.RunOnStartup)
        {
            logger.LogInformation("Migrations desabilitadas no startup (Migrations:RunOnStartup=false). Env={Env}", environment.EnvironmentName);
            return;
        }

        var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();

        logger.LogInformation("Executando migrations... Env={Env}", environment.EnvironmentName);
        runner.MigrateUp();
        logger.LogInformation("Migrations concluídas.");

        await Task.CompletedTask;
    }
}
