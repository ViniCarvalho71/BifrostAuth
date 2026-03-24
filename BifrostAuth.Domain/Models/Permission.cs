using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Models
{
    public class Permission : EntityBase
    {
        public virtual string Name { get; set; }

        public virtual IList<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}
