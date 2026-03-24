using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Models
{
    public class Application : EntityBase
    {
        public virtual string Name { get; set; }

        public virtual string ClientId { get; set; }

        public virtual string ClientSecret { get; set; }

        public virtual string RedirectUrl { get; set; }

        public virtual bool IsActive { get; set; }
    }
}
