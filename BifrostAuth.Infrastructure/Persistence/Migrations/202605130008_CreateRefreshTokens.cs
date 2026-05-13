using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130008, "Create RefreshTokens table")]
public sealed class CreateRefreshTokens_202605130008 : Migration
{
    public override void Up()
    {
        Create.Table("refreshtokens")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("userid").AsGuid().NotNullable()
            .WithColumn("token").AsString(500).NotNullable()
            .WithColumn("expiresat").AsDateTime2().NotNullable()
            .WithColumn("revokedat").AsDateTime2().Nullable()
            .WithColumn("replacedbytoken").AsString(500).Nullable()
            .WithColumn("createdbyip").AsString(50).Nullable();

        Create.ForeignKey("fk_refreshtokens_user")
            .FromTable("refreshtokens").ForeignColumn("userid")
            .ToTable("users").PrimaryColumn("id")
            .OnDeleteOrUpdate(System.Data.Rule.Cascade);

        Create.Index("ix_refreshtokens_userid").OnTable("refreshtokens")
            .OnColumn("userid").Ascending();

        Create.Index("ux_refreshtokens_token").OnTable("refreshtokens")
            .OnColumn("token").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Table("refreshtokens");
    }
}
