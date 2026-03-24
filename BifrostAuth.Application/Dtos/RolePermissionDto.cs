using System;

namespace BifrostAuth.Application.Dtos
{
    public class RolePermissionDto
    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public Guid PermissionId { get; set; }
    }
}
