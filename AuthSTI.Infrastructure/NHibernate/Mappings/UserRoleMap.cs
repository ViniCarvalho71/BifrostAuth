using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.Mappings
{
    public class UserRoleMap : EntityBaseMap<UserRole>
    {
        public UserRoleMap()
        {
            Table("UserRoles");

            Map(x => x.UserId)
            .CustomSqlType("char(36)")
            .Not.Nullable();

            Map(x => x.RoleId)
                .CustomSqlType("char(36)")
                .Not.Nullable();

            References(x => x.User)
                .Column("UserId")
                .Not.Nullable()
                .ForeignKey("FK_UserRole_User")
                .Not.Insert()
                .Not.Update();

            References(x => x.Role)
                .Column("RoleId")
                .Not.Nullable()
                .ForeignKey("FK_UserRole_Role")
                .Not.Insert()
                .Not.Update();
        }
    }
}
