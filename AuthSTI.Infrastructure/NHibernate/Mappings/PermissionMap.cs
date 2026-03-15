using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Infrastructure.NHibernate.Mappings
{
    public class PermissionMap : EntityBaseMap<Permission>
    {
        public PermissionMap()
        {
            Table("Permissions");

            Map(x => x.Name)
                .Length(150)
                .Not.Nullable();

            HasMany(x => x.RolePermissions)
                .KeyColumn("PermissionId")
                .Inverse()
                .Cascade.All();
        }
    }
}
