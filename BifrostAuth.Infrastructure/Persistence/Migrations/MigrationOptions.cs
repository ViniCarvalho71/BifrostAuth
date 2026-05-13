namespace BifrostAuth.Infrastructure.Persistence.Migrations;

public sealed class MigrationOptions
{
    /// <summary>
    /// Controla execução automática no startup.
    /// Sugestão: true em Development; false em Production (a não ser que você queira migração automática em prod).
    /// </summary>
    public bool RunOnStartup { get; set; }

    /// <summary>
    /// Tags do FluentMigrator (ex.: "Development"). Quando definido, o runner só executa migrations com essas tags.
    /// </summary>
    public string[]? Tags { get; set; }
}
