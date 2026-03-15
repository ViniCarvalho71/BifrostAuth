using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.Mappings
{
    public class RoleMap : EntityBaseMap<Role>
    {
        public RoleMap()
        {
            Table("Roles");

            Map(x => x.Name)
                .Length(100)
                .Not.Nullable();

            HasMany(x => x.UserRoles)
                .KeyColumn("RoleId")
                .Inverse()
                .Cascade.All();

            HasMany(x => x.RolePermissions)
                .KeyColumn("RoleId")
                .Inverse()
                .Cascade.All();
        }
    }
}
