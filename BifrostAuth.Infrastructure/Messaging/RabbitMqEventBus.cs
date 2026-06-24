using BifrostAuth.Infrastructure.Configuration;
using BifrostAuth.Messaging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace BifrostAuth.Infrastructure.Messaging
{
    public class RabbitMqEventBus: IEventBus
    {
        private readonly RabbitMqOptions _options;
        private readonly IConnection _connection;
        private readonly IChannel _channel;

        public RabbitMqEventBus(
            IOptions<RabbitMqOptions> options,
            RabbitMqConnection connection)
        {
            _options = options.Value;
            _connection = connection.Connection;

            _channel = _connection.CreateChannelAsync()
                .GetAwaiter()
                .GetResult();
        }

        public async Task PublishAsync<T>(T @event)
        {
            var routingKey = typeof(T).Name.Replace("Event", "").ToLower();

            await _channel.ExchangeDeclareAsync(
                _options.ExchangeName,
                ExchangeType.Direct,
                durable: true);

            var body = Encoding.UTF8.GetBytes(
                JsonSerializer.Serialize(@event));

            await _channel.BasicPublishAsync(
                exchange: _options.ExchangeName,
                routingKey: routingKey,
                body: body);
        }

    }
}
