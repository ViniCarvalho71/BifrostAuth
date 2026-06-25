using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Domain.Models
{
    public class Email
    {
        public string Recipient { get; set; }
        public string Writer { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
