using System;

namespace BifrostAuth.Application.Dtos
{
    public class RefreshTokenDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public string ReplacedByToken { get; set; } = string.Empty;
        public string CreatedByIp { get; set; } = string.Empty;
    }
}
