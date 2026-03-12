using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Models
{
    public class RolePermission : EntityBase
    {
        public virtual Guid RoleId { get; set; }

        public virtual Guid PermissionId { get; set; }

        public virtual Role Role { get; set; }

        public virtual Permission Permission { get; set; }
    }
}
