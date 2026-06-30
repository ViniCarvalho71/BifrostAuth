using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Messaging.Events
{
    public record UserCreatedEvent(
        Guid UserId,
        string Email,
        string Login,
        string ConfirmationToken 
     );
}
