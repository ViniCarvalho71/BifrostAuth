using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Models
{
    public class Role : EntityBase
    {
        public virtual string Name { get; set; }

        public virtual IList<UserRole> UserRoles { get; set; } = new List<UserRole>();

        public virtual IList<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}
