using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130003, "Create UserRoles table")]
public sealed class CreateUserRoles_202605130003 : Migration
{
    public override void Up()
    {
        Create.Table("userroles")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("userid").AsGuid().NotNullable()
            .WithColumn("roleid").AsGuid().NotNullable();

        Create.ForeignKey("fk_userrole_user")
            .FromTable("userroles").ForeignColumn("userid")
            .ToTable("users").PrimaryColumn("id")
            .OnDeleteOrUpdate(System.Data.Rule.Cascade);

        Create.ForeignKey("fk_userrole_role")
            .FromTable("userroles").ForeignColumn("roleid")
            .ToTable("roles").PrimaryColumn("id")
            .OnDeleteOrUpdate(System.Data.Rule.Cascade);

        Create.Index("ix_userroles_userid").OnTable("userroles")
            .OnColumn("userid").Ascending();

        Create.Index("ix_userroles_roleid").OnTable("userroles")
            .OnColumn("roleid").Ascending();

        Create.Index("ux_userroles_userid_roleid").OnTable("userroles")
            .OnColumn("userid").Ascending()
            .OnColumn("roleid").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Table("userroles");
    }
}
