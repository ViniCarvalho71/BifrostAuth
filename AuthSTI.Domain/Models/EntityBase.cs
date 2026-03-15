using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Models
{
    public class EntityBase
    {
        public virtual Guid Id { get; set; }
        public virtual DateTime CreatedAt { get; set; }
        public virtual DateTime UpdatedAt { get; set; }

    }
}
