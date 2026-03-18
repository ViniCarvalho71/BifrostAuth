using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Domain.Models
{
    public class UserApplication : EntityBase
    {
        public virtual Guid UserId { get; set; }
        public virtual Guid ApplicationId { get; set; }

        public virtual User User { get; set; }
        public virtual Application Application { get; set; }

    }
}
