using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.NHibernate.Mappings
{
    public class UserRoleMap : EntityBaseMap<UserRole>
    {
        public UserRoleMap()
        {
            Table("UserRoles");

            Map(x => x.UserId)
            .CustomSqlType("uuid")
            .Not.Nullable();

            Map(x => x.RoleId)
                .CustomSqlType("uuid")
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
