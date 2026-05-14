namespace BifrostAuth.Infrastructure.Persistence.Seeds;

public sealed class ApplicationSeedOptions
{
    public bool Enabled { get; set; } = true;

    public string Name { get; set; } = "BifrostAuth";

    public string ClientId { get; set; } = "bifrost_app_8080";

    /// <summary>
    /// Em produção, recomenda-se definir via variável de ambiente.
    /// Em desenvolvimento, se não for informado, será gerado automaticamente.
    /// </summary>
    public string? ClientSecret { get; set; } 

    public string? RedirectUrl { get; set; } = "http://localhost:8080";

    public bool IsActive { get; set; } = true;
}
