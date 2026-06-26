using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Models
{
    public class RefreshToken : EntityBase
    {
        public virtual Guid UserId { get; set; }

        public virtual Guid ApplicationId { get; set; }

        public virtual string Token { get; set; }

        public virtual DateTime ExpiresAt { get; set; }

        public virtual DateTime? RevokedAt { get; set; }

        public virtual string ReplacedByToken { get; set; }

        public virtual string CreatedByIp { get; set; }

        public virtual User User { get; set; }

        public virtual bool IsExpired => DateTime.UtcNow >= ExpiresAt;

        public virtual bool IsActive => RevokedAt == null && !IsExpired;
    }
}
