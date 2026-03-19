using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.Mappings
{
    public class RolePermissionMap : EntityBaseMap<RolePermission>
    {
        public RolePermissionMap()
        {
            Table("RolePermissions");

            Map(x => x.RoleId)
                .CustomSqlType("char(36)")
                .Not.Nullable();

            Map(x => x.PermissionId)
                .CustomSqlType("char(36)")
                .Not.Nullable();

            References(x => x.Role)
                .Column("RoleId")
                .Not.Nullable()
                .ForeignKey("FK_RolePermission_Role")
                .Not.Insert()
                .Not.Update();

            References(x => x.Permission)
                .Column("PermissionId")
                .Not.Nullable()
                .ForeignKey("FK_RolePermission_Permission")
                .Not.Insert()
                .Not.Update();
        }
    }
}
