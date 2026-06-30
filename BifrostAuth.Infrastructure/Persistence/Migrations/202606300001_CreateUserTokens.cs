using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202606300001, "Create UserTokens table")]
public sealed class CreateUserTokens_202606300001 : Migration
{
    public override void Up()
    {
        Create.Table("usertokens")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("userid").AsGuid().NotNullable()
            .WithColumn("tokentype").AsInt32().NotNullable()
            .WithColumn("tokenhash").AsString(64).NotNullable()
            .WithColumn("usedat").AsDateTime2().Nullable()
            .WithColumn("expiresat").AsDateTime2().NotNullable();

        Create.ForeignKey("fk_usertokens_user")
            .FromTable("usertokens").ForeignColumn("userid")
            .ToTable("users").PrimaryColumn("id")
            .OnDeleteOrUpdate(System.Data.Rule.Cascade);

        Create.Index("ix_usertokens_userid")
            .OnTable("usertokens")
            .OnColumn("userid").Ascending();

        Create.Index("ux_usertokens_tokenhash")
            .OnTable("usertokens")
            .OnColumn("tokenhash").Ascending()
            .WithOptions().Unique();

        Create.Index("ix_usertokens_type")
            .OnTable("usertokens")
            .OnColumn("tokentype").Ascending();
    }

    public override void Down()
    {
        Delete.Table("usertokens");
    }
}