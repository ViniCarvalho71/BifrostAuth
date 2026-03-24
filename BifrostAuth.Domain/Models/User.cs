using BifrostAuth.Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BifrostAuth.Models
{
    public class User : EntityBase
    {
        public virtual string Login { get; set; }

        public virtual string Email { get; set; }

        public virtual string PasswordHash { get; set; }

        public virtual bool IsActive { get; set; }

        public virtual IList<UserRole> UserRoles { get; set; } = new List<UserRole>();

        public virtual IList<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

        public virtual IList<UserApplication> UserApplications { get; set; }

    }
}
