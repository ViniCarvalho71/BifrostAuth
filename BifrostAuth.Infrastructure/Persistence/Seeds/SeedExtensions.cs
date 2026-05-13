using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BifrostAuth.Infrastructure.Persistence.Seeds;

public static class SeedExtensions
{
    public static IServiceCollection AddBifrostSeeds(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        services.Configure<AdminSeedOptions>(options =>
        {
            configuration.GetSection("Seed:Admin").Bind(options);

            if (!configuration.GetSection("Seed:Admin").Exists())
            {
                options.Enabled = environment.IsDevelopment();
            }
        });

        services.Configure<ApplicationSeedOptions>(options =>
        {
            configuration.GetSection("Seed:Application").Bind(options);

            if (!configuration.GetSection("Seed:Application").Exists())
            {
                options.Enabled = environment.IsDevelopment();
            }
        });

        services.AddScoped<SeedRunner>();

        return services;
    }

    public static async Task RunBifrostSeedsAsync(this IHost host, CancellationToken cancellationToken = default)
    {
        using var scope = host.Services.CreateScope();

        var environment = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Seeds");
        var adminOptions = scope.ServiceProvider.GetRequiredService<IOptions<AdminSeedOptions>>().Value;
        var appOptions = scope.ServiceProvider.GetRequiredService<IOptions<ApplicationSeedOptions>>().Value;

        if (!adminOptions.Enabled && !appOptions.Enabled)
        {
            logger.LogInformation("Seeds desabilitados (Seed:Admin:Enabled=false e Seed:Application:Enabled=false). Env={Env}", environment.EnvironmentName);
            return;
        }

        logger.LogInformation("Executando seeds... Env={Env}", environment.EnvironmentName);

        var seeder = scope.ServiceProvider.GetRequiredService<SeedRunner>();
        await seeder.RunAsync(cancellationToken);

        logger.LogInformation("Seeds concluídos.");
    }
}
