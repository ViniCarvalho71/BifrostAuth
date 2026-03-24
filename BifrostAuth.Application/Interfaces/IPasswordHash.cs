using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Application.Interfaces
{
    public interface IPasswordHash
    {
        string Hash(string password);
        bool Verify(string hash, string password);
    }
}
