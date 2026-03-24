using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BifrostAuth.Models
{
    public class Audit : EntityBase
    {
        [Required]
        public virtual Guid UserId { get; set; }
        [Required]
        public virtual string Action { get; set; }  
        public virtual string PreviouValue {  get; set; }
        public virtual string NewValue { get; set; }
    }
}
