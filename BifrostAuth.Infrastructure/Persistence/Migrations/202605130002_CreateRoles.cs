using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130002, "Create Roles table")]
public sealed class CreateRoles_202605130002 : Migration
{
    public override void Up()
    {
        Create.Table("roles")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("name").AsString(100).NotNullable();

        Create.Index("ux_roles_name").OnTable("roles")
            .OnColumn("name").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Table("roles");
    }
}
