using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSTI.Application.Interfaces
{
    public interface IAuthService
    {
        public string GenerateToken(string userId, string email, string login, IList<string> roles, IList<string> permissions, string client_id);
        public string Login(string email, string password, string client_id);
    }
}
