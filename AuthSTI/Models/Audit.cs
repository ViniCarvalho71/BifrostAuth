using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AuthSTI.Models
{
    public class Audit : EntityBase
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public string Action { get; set; }  
        public string PreviouValue {  get; set; }
        public string NewValue { get; set; }
    }
}
