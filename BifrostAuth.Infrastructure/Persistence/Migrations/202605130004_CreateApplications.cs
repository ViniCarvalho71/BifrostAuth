using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130004, "Create Applications table")]
public sealed class CreateApplications_202605130004 : Migration
{
    public override void Up()
    {
        Create.Table("applications")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("name").AsString(200).NotNullable()
            .WithColumn("clientid").AsString(200).NotNullable()
            .WithColumn("clientsecret").AsString(500).NotNullable()
            .WithColumn("redirecturl").AsString(500).Nullable()
            .WithColumn("isactive").AsBoolean().NotNullable();

        Create.Index("ux_applications_clientid").OnTable("applications")
            .OnColumn("clientid").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Table("applications");
    }
}
