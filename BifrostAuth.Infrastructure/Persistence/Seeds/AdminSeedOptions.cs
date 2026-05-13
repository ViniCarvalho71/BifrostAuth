namespace BifrostAuth.Infrastructure.Persistence.Seeds;

public sealed class AdminSeedOptions
{
    public bool Enabled { get; set; } = true;

    public string RoleName { get; set; } = "ADMIN";

    public string Login { get; set; } = "admin";

    public string Email { get; set; } = "admin@bifrost.local";

    /// <summary>
    /// Em produção, recomenda-se definir via variável de ambiente.
    /// Em desenvolvimento, se não for informado, será usado um default (com warning).
    /// </summary>
    public string? Password { get; set; }

    public bool IsActive { get; set; } = true;
}
