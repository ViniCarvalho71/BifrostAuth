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
        private readonly string _frontendUrl;
        public EmailSender(IEmailService emailService) 
        {
            _emailService = emailService;
            _frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:3000";
        }

        public async Task SendConfirmationEmailAsync(
        string recipient,
        string login,
        string token)
        {
            var templatePath = Path.Combine(
                AppContext.BaseDirectory,
                "Templates",
                "welcome_template.html");

            var template =
                await File.ReadAllTextAsync(templatePath);

            string confirmationUrl =
            $"{_frontendUrl}/confirm-email?token={Uri.EscapeDataString(token)}";

            template = template.Replace("{{LOGIN}}", login);
            template = template.Replace("{{ANO}}", DateTime.Now.Year.ToString());
            template = template.Replace("{{CONFIRMATION_URL}}", confirmationUrl);

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
