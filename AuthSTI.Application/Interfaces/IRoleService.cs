using AuthSTI.Application.Dtos;
using System;
using System.Collections.Generic;

namespace AuthSTI.Application.Interfaces
{
    public interface IRoleService
    {
        RoleDto Get(Guid id);
        IReadOnlyCollection<RoleDto> GetAll();
        void Save(RoleDto dto);
        void Update(RoleDto dto);
        void Delete(Guid id);
    }
}
