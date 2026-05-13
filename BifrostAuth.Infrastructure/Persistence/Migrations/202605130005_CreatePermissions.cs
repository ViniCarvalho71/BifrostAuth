using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130005, "Create Permissions table")]
public sealed class CreatePermissions_202605130005 : Migration
{
    public override void Up()
    {
        Create.Table("permissions")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("name").AsString(150).NotNullable();

        Create.Index("ux_permissions_name").OnTable("permissions")
            .OnColumn("name").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Table("permissions");
    }
}
