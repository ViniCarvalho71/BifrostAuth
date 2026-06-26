using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Application.Dtos
{
    public class AuthDto
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
