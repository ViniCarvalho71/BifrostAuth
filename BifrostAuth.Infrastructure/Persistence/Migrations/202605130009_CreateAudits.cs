using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130009, "Create Audits table")]
public sealed class CreateAudits_202605130009 : Migration
{
    public override void Up()
    {
        Create.Table("audits")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("userid").AsGuid().NotNullable()
            .WithColumn("action").AsString(200).NotNullable()
            .WithColumn("previouvalue").AsString(2000).Nullable()
            .WithColumn("newvalue").AsString(2000).Nullable();

        Create.Index("ix_audits_userid").OnTable("audits")
            .OnColumn("userid").Ascending();
    }

    public override void Down()
    {
        Delete.Table("audits");
    }
}
