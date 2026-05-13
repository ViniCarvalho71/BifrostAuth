using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130001, "Create Users table")]
public sealed class CreateUsers_202605130001 : Migration
{
    public override void Up()
    {
        Create.Table("users")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("login").AsString(100).NotNullable()
            .WithColumn("email").AsString(200).NotNullable()
            .WithColumn("password").AsString(500).NotNullable()
            .WithColumn("isactive").AsBoolean().NotNullable();

        Create.Index("ux_users_login").OnTable("users")
            .OnColumn("login").Ascending()
            .WithOptions().Unique();

        Create.Index("ux_users_email").OnTable("users")
            .OnColumn("email").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Table("users");
    }
}
