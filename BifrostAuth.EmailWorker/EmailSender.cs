using BifrostAuth.Application.Interfaces;
using BifrostAuth.Application.Sevices;
using BifrostAuth.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.EmailWorker
{
    public class EmailSender
    {
        private readonly IEmailService _emailService;
        public EmailSender(IEmailService emailService) 
        {
            _emailService = emailService;
        }

        public async Task SendWelcomeEmailAsync(
        string recipient,
        string login)
        {
            var templatePath = Path.Combine(
                AppContext.BaseDirectory,
                "Templates",
                "welcome_template.html");

            var template =
                await File.ReadAllTextAsync(templatePath);

            template = template.Replace("{{LOGIN}}", login);
            template = template.Replace("{{ANO}}", DateTime.Now.Year.ToString());
            template = template.Replace("{{URL_LOGIN}}", "https://app.bifrostauth.com/login");

            var email = new Email
            {
                Recipient = recipient,
                Writer = "noreply@bifrostauth.com",
                Subject = "Bem-vindo ao Bifrost Auth",
                Body = template
            };

            await _emailService.SendEmailAsync(email);
        }
    }
}
