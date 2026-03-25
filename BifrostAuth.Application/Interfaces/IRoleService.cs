using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Interfaces
{
    public interface IRoleService
    {
        RoleDto Get(Guid id);
        IQueryable<RoleDto> Get();
        IReadOnlyCollection<RoleDto> GetAll();
        void Save(RoleDto dto);
        void Update(RoleDto dto);
        void Delete(Guid id);
    }
}
