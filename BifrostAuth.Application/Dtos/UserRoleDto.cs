using System;

namespace BifrostAuth.Application.Dtos
{
    public class UserRoleDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
    }
}
