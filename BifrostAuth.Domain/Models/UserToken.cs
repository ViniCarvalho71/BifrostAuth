using BifrostAuth.Domain.Enums;
using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Domain.Models
{
    public class UserToken : EntityBase
    {
        public virtual Guid UserId { get; set; }
        public virtual TokenType TokenType { get; set; }
        public virtual string TokenHash { get; set; } = string.Empty;
        public virtual DateTime? UsedAt { get; set; }
        public virtual DateTime ExpiresAt { get; set; }
    }
}
