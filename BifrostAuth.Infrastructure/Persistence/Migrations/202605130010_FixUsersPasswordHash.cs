using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

// Corrige bancos antigos criados via NHibernate SchemaUpdate que tinham `users.passwordhash` NOT NULL.
// O modelo atual usa a coluna `password`.
[Migration(202605130010, "Fix legacy users.passwordhash -> users.password")]
public sealed class FixUsersPasswordHash_202605130010 : Migration
{
    public override void Up()
    {
        if (!Schema.Table("users").Exists())
            return;

        if (!Schema.Table("users").Column("passwordhash").Exists())
            return;

        // Garante que existe a coluna password
        if (!Schema.Table("users").Column("password").Exists())
        {
            Alter.Table("users")
                .AddColumn("password").AsString(500).Nullable();
        }

        // Copia passwordhash -> password (onde password estiver null/vazio)
        Execute.Sql("UPDATE users SET password = passwordhash WHERE (password IS NULL OR password = '');");

        // Remove a coluna antiga
        Delete.Column("passwordhash").FromTable("users");

        // Normaliza isactive
        if (Schema.Table("users").Column("isactive").Exists())
        {
            Execute.Sql("UPDATE users SET isactive = TRUE WHERE isactive IS NULL;");
            Alter.Column("isactive").OnTable("users").AsBoolean().NotNullable();
        }

        // Agora password deve ser obrigatório
        Alter.Column("password").OnTable("users").AsString(500).NotNullable();
    }

    public override void Down()
    {
        // Sem rollback automático: a coluna passwordhash é legado.
    }
}
