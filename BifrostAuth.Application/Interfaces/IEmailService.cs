using BifrostAuth.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Application.Interfaces
{
    public interface IEmailService
    {
       Task SendEmailAsync(Email email);
    }
}
