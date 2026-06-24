using BifrostAuth.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.Messaging
{
    public class RabbitMqConnection : IDisposable
    {
        public IConnection Connection { get; }

        public RabbitMqConnection(IOptions<RabbitMqOptions> options)
        {
            var factory = new ConnectionFactory
            {
                HostName = options.Value.HostName,
                UserName = options.Value.UserName,
                Password = options.Value.Password,
                Port = options.Value.Port,
                VirtualHost = options.Value.VirtualHost,
                AutomaticRecoveryEnabled = true,
                NetworkRecoveryInterval = TimeSpan.FromSeconds(10)
            };

            Connection = factory.CreateConnectionAsync()
                .GetAwaiter()
                .GetResult();
        }

        public void Dispose()
        {
            Connection?.Dispose();
        }
    }
}
