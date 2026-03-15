using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Models
{
    public class UserRole : EntityBase
    {
        public virtual Guid UserId { get; set; }

        public virtual Guid RoleId { get; set; }

        public virtual User User { get; set; }

        public virtual Role Role { get; set; }
    }
}
