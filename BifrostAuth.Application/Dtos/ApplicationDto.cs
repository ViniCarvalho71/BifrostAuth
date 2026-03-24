using System;

namespace BifrostAuth.Application.Dtos
{
    public class ApplicationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string RedirectUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
