namespace BifrostAuth.Messaging.Abstractions
{
    public interface IEventBus
    {
        Task PublishAsync<T>(T @event);
    }
}
