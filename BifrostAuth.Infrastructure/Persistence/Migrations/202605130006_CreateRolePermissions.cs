using FluentMigrator;

namespace BifrostAuth.Infrastructure.Persistence.Migrations;

[Migration(202605130006, "Create RolePermissions table")]
public sealed class CreateRolePermissions_202605130006 : Migration
{
    public override void Up()
    {
        Create.Table("rolepermissions")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("createdat").AsDateTime2().NotNullable()
            .WithColumn("updatedat").AsDateTime2().NotNullable()
            .WithColumn("roleid").AsGuid().NotNullable()
            .WithColumn("permissionid").AsGuid().NotNullable();

        Create.ForeignKey("fk_rolepermission_role")
            .FromTable("rolepermissions").ForeignColumn("roleid")
            .ToTable("roles").PrimaryColumn("id")
            .OnDeleteOrUpdate(System.Data.Rule.Cascade);

        Create.ForeignKey("fk_rolepermission_permission")
            .FromTable("rolepermissions").ForeignColumn("permissionid")
            .ToTable("permissions").PrimaryColumn("id")
            .OnDeleteOrUpdate(System.Data.Rule.Cascade);

        Create.Index("ix_rolepermissions_roleid").OnTable("rolepermissions")
            .OnColumn("roleid").Ascending();

        Create.Index("ix_rolepermissions_permissionid").OnTable("rolepermissions")
            .OnColumn("permissionid").Ascending();

        Create.Index("ux_rolepermissions_roleid_permissionid").OnTable("rolepermissions")
            .OnColumn("roleid").Ascending()
            .OnColumn("permissionid").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Table("rolepermissions");
    }
}
