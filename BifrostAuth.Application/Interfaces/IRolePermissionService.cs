using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;

namespace BifrostAuth.Application.Interfaces
{
    public interface IRolePermissionService
    {
        RolePermissionDto Get(Guid id);
        IReadOnlyCollection<RolePermissionDto> GetAll();
        void Save(RolePermissionDto dto);
        void Update(RolePermissionDto dto);
        void Delete(Guid id);
    }
}
