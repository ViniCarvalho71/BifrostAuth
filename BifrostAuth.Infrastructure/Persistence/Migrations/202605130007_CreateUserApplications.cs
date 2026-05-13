using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130007, "Create UserApplications table")]
public sealed class CreateUserApplications_202605130007 : Migration
{
    public override void Up()
    {
        Create.Table("userapplications")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("userid").AsGuid().NotNullable()
            .WithColumn("applicationid").AsGuid().NotNullable();

        Create.ForeignKey("fk_userapplication_user")
            .FromTable("userapplications").ForeignColumn("userid")
            .ToTable("users").PrimaryColumn("id")
            .OnDeleteOrUpdate(System.Data.Rule.Cascade);

        Create.ForeignKey("fk_userapplication_application")
            .FromTable("userapplications").ForeignColumn("applicationid")
            .ToTable("applications").PrimaryColumn("id")
            .OnDeleteOrUpdate(System.Data.Rule.Cascade);

        Create.Index("ix_userapplications_userid").OnTable("userapplications")
            .OnColumn("userid").Ascending();

        Create.Index("ix_userapplications_applicationid").OnTable("userapplications")
            .OnColumn("applicationid").Ascending();

        Create.Index("ux_userapplications_userid_applicationid").OnTable("userapplications")
            .OnColumn("userid").Ascending()
            .OnColumn("applicationid").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Table("userapplications");
    }
}
