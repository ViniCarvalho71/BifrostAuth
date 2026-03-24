using System;

namespace BifrostAuth.Application.Dtos
{
    public class AuditDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string PreviouValue { get; set; } = string.Empty;
        public string NewValue { get; set; } = string.Empty;
    }
}
