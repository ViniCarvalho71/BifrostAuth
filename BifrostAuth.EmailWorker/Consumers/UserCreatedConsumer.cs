using BifrostAuth.Infrastructure.Messaging;
using BifrostAuth.Messaging.Events;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace BifrostAuth.EmailWorker.Consumers;

public class UserCreatedConsumer : BackgroundService
{
    private readonly IConnection _connection;
    private IChannel? _channel;
    private readonly IServiceProvider _serviceProvider;

    public UserCreatedConsumer(
        RabbitMqConnection rabbitMqConnection,
        IServiceProvider serviceProvider)
    {
        _connection = rabbitMqConnection.Connection;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        _channel = await _connection.CreateChannelAsync();

        const string queueName = "usercreated";

        await _channel.QueueDeclareAsync(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false);

        await _channel.QueueBindAsync(
            queue: queueName,
            exchange: "bifrost.exchange",
            routingKey: queueName);

        var consumer = new AsyncEventingBasicConsumer(_channel);

        consumer.ReceivedAsync += async (_, args) =>
        {
            try
            {
                
                var json = Encoding.UTF8.GetString(
                    args.Body.ToArray());

                var evt = JsonSerializer.Deserialize<UserCreatedEvent>(
                    json);

                if (evt is not null)
                {
                    await Handle(evt);
                }

                await _channel.BasicAckAsync(
                    deliveryTag: args.DeliveryTag,
                    multiple: false);
            }
            catch (Exception)
            {
                await _channel.BasicNackAsync(
                    deliveryTag: args.DeliveryTag,
                    multiple: false,
                    requeue: true);
            }
        };

        await _channel.BasicConsumeAsync(
            queue: queueName,
            autoAck: false,
            consumer: consumer);

        await Task.Delay(
            Timeout.Infinite,
            stoppingToken);
    }

    private async Task Handle(UserCreatedEvent evt)
    {
        using var scope = _serviceProvider.CreateScope();

        var emailSender =
        scope.ServiceProvider.GetRequiredService<EmailSender>();

        await emailSender.SendConfirmationEmailAsync(
            evt.Email,
            evt.Login,
            evt.ConfirmationToken);
    }

    public override async Task StopAsync(
        CancellationToken cancellationToken)
    {
        if (_channel is not null)
        {
            await _channel.CloseAsync();
            await _channel.DisposeAsync();
        }

        await base.StopAsync(cancellationToken);
    }
}