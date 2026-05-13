using BifrostAuth.Domain.Models;
using BifrostAuth.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NHibernate;
using NHibernate.Linq;

namespace BifrostAuth.Infrastructure.Persistence.Seeds;

public sealed class SeedRunner
{
    private readonly IHostEnvironment _environment;
    private readonly AdminSeedOptions _adminOptions;
    private readonly ApplicationSeedOptions _applicationOptions;
    private readonly ILogger<SeedRunner> _logger;
    private readonly ISession _session;

    public SeedRunner(
        ISession session,
        IHostEnvironment environment,
        IOptions<AdminSeedOptions> adminOptions,
        IOptions<ApplicationSeedOptions> applicationOptions,
        ILogger<SeedRunner> logger)
    {
        _session = session;
        _environment = environment;
        _adminOptions = adminOptions.Value;
        _applicationOptions = applicationOptions.Value;
        _logger = logger;
    }

    public async Task RunAsync(CancellationToken cancellationToken)
    {
        if (!_adminOptions.Enabled && !_applicationOptions.Enabled)
        {
            _logger.LogInformation("Seeds desabilitados (Seed:Admin:Enabled=false e Seed:Application:Enabled=false). Env={Env}", _environment.EnvironmentName);
            return;
        }

        var now = DateTime.UtcNow;

        using var tx = _session.BeginTransaction();

        try
        {
            Models.Application? application = null;

            if (_applicationOptions.Enabled)
            {
                application = await EnsureApplicationAsync(now, cancellationToken);
            }

            if (_adminOptions.Enabled)
            {
                var password = ResolveAdminPassword();
                var role = await EnsureRoleAsync(_adminOptions.RoleName, now, cancellationToken);
                var user = await EnsureUserAsync(_adminOptions.Login, _adminOptions.Email, password, _adminOptions.IsActive, now, cancellationToken);

                await EnsureUserRoleAsync(user.Id, role.Id, now, cancellationToken);

                if (application != null)
                {
                    await EnsureUserApplicationAsync(user.Id, application.Id, now, cancellationToken);
                }
                else
                {
                    _logger.LogWarning("Seed de admin executado sem Application padrão; login pode falhar se o usuário não estiver vinculado a alguma aplicação.");
                }
            }

            await tx.CommitAsync(cancellationToken);
        }
        catch
        {
            await tx.RollbackAsync(cancellationToken);
            throw;
        }

        _logger.LogInformation("Seeds iniciais concluídos. Env={Env}", _environment.EnvironmentName);
    }

    private string ResolveAdminPassword()
    {
        if (!string.IsNullOrWhiteSpace(_adminOptions.Password))
            return _adminOptions.Password;

        if (_environment.IsDevelopment())
        {
            const string devDefault = "Admin@123";
            _logger.LogWarning("AdminSeed:Password não configurado; usando default de desenvolvimento. Defina Seed__Admin__Password em produção.");
            return devDefault;
        }

        throw new InvalidOperationException("AdminSeed:Password é obrigatório em Production. Configure via Seed__Admin__Password.");
    }

    private async Task<Models.Application> EnsureApplicationAsync(DateTime now, CancellationToken cancellationToken)
    {
        var existing = await _session.Query<Models.Application>()
            .FirstOrDefaultAsync(a => a.ClientId == _applicationOptions.ClientId, cancellationToken);

        if (existing != null)
            return existing;

        var clientSecret = ResolveApplicationSecret();

        var application = new Models.Application
        {
            Id = Guid.NewGuid(),
            Name = _applicationOptions.Name,
            ClientId = _applicationOptions.ClientId,
            ClientSecret = clientSecret,
            RedirectUrl = _applicationOptions.RedirectUrl ?? string.Empty,
            IsActive = _applicationOptions.IsActive,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _session.SaveAsync(application, cancellationToken);

        _logger.LogInformation("Application padrão criada: clientId={ClientId}", _applicationOptions.ClientId);

        return application;
    }

    private string ResolveApplicationSecret()
    {
        if (!string.IsNullOrWhiteSpace(_applicationOptions.ClientSecret))
            return _applicationOptions.ClientSecret;

        if (_environment.IsDevelopment())
        {
            var generated = Convert.ToBase64String(Guid.NewGuid().ToByteArray()) + Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            _logger.LogWarning("Seed:Application:ClientSecret não configurado; gerando automaticamente para Development.");
            return generated;
        }

        throw new InvalidOperationException("Seed:Application:ClientSecret é obrigatório em Production quando Seed:Application:Enabled=true.");
    }

    private async Task<Role> EnsureRoleAsync(string roleName, DateTime now, CancellationToken cancellationToken)
    {
        var existing = await _session.Query<Role>()
            .FirstOrDefaultAsync(r => r.Name == roleName, cancellationToken);

        if (existing != null)
            return existing;

        var role = new Role
        {
            Id = Guid.NewGuid(),
            Name = roleName,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _session.SaveAsync(role, cancellationToken);
        return role;
    }

    private async Task<User> EnsureUserAsync(string login, string email, string passwordPlainText, bool isActive, DateTime now, CancellationToken cancellationToken)
    {
        var existing = await _session.Query<User>()
            .FirstOrDefaultAsync(u => u.Email == email || u.Login == login, cancellationToken);

        if (existing != null)
            return existing;

        var hash = BCrypt.Net.BCrypt.HashPassword(passwordPlainText);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Login = login,
            Email = email,
            Password = hash,
            IsActive = isActive,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _session.SaveAsync(user, cancellationToken);
        return user;
    }

    private async Task EnsureUserRoleAsync(Guid userId, Guid roleId, DateTime now, CancellationToken cancellationToken)
    {
        var exists = await _session.Query<UserRole>()
            .AnyAsync(ur => ur.UserId == userId && ur.RoleId == roleId, cancellationToken);

        if (exists)
            return;

        var link = new UserRole
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            RoleId = roleId,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _session.SaveAsync(link, cancellationToken);
    }

    private async Task EnsureUserApplicationAsync(Guid userId, Guid applicationId, DateTime now, CancellationToken cancellationToken)
    {
        var exists = await _session.Query<UserApplication>()
            .AnyAsync(ua => ua.UserId == userId && ua.ApplicationId == applicationId, cancellationToken);

        if (exists)
            return;

        var link = new UserApplication
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ApplicationId = applicationId,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _session.SaveAsync(link, cancellationToken);
    }
}
