using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Application.Dtos
{
    public class RegisterUserDto
    {
        public string Login { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
    }
}
