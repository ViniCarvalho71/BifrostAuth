using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Models;
using BifrostAuth.Infrastructure.Configuration;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace BifrostAuth.EmailWorker.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailOptions _options;

        public EmailService(IOptions<EmailOptions> options)
        {
            _options = options.Value;
        }
        public async Task SendEmailAsync(Email email)
        {
            var message = new MimeMessage();

            message.From.Add(
                new MailboxAddress(
                    _options.SenderName,
                    _options.SenderEmail));

            message.To.Add(
                MailboxAddress.Parse(email.Recipient));

            message.Subject = email.Subject;

            message.Body = new TextPart("html")
            {
                Text = email.Body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                _options.Host,
                _options.Port,
                SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(
                _options.Username,
                _options.Password);

            await smtp.SendAsync(message);

            await smtp.DisconnectAsync(true);
        }

    }
}

