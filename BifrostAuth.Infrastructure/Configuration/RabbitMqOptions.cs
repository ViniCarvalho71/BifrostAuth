using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Infrastructure.Configuration
{
    public class RabbitMqOptions
    {
        public string HostName { get; set; } = "";
        public string UserName { get; set; } = "";
        public string Password { get; set; } = "";
        public string ExchangeName { get; set; } = "bifrost.events";
        public int Port { get; set; } = 5672;
        public string VirtualHost { get; set; } = "/";
    }
}
