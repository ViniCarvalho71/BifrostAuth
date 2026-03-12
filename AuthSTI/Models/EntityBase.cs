using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Models
{
    public class EntityBase
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
