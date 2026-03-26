using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Application.Interfaces
{
    public interface IEmailService
    {
        void SendEmail(string to, string subject, string body);
    }
}
