using System;
using System.Collections.Generic;
using System.Text;

namespace BifrostAuth.Domain.Enums
{
    public enum TokenType
    {
        EmailConfirmation = 1,

        PasswordReset = 2,

        ChangeEmail = 3,

        MagicLink = 4
    }
}
