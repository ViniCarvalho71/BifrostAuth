using System;
using System.Collections.Generic;
using System.Text;
using BifrostAuth.Application.Interfaces;

namespace BifrostAuth.Application.Criptografy
{
    public class PasswordHasher : IPasswordHash
    {
        public string Hash(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool Verify(string hash, string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
