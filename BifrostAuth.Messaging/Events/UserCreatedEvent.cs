using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Domain.Events
{
    public record UserCreatedEvent(
        Guid UserId,
        string Email,
        string Login
     );
}
