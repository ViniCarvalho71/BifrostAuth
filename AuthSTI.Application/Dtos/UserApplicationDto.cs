using System;

namespace AuthSTI.Application.Dtos
{
    public class UserApplicationDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ApplicationId { get; set; }
    }
}
