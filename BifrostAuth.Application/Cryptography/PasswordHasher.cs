using System;
using System.Collections.Generic;
using System.Text;
using BifrostAuth.Application.Interfaces;

namespace BifrostAuth.Application.Criptography
{
    public class PasswordHasher : IHasher
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
