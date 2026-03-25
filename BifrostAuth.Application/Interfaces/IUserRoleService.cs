using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Interfaces
{
    public interface IUserRoleService
    {
        UserRoleDto Get(Guid id);
        IQueryable<UserRoleDto> Get();
        IReadOnlyCollection<UserRoleDto> GetAll();
        void Save(UserRoleDto dto);
        void Update(UserRoleDto dto);
        void Delete(Guid id);
    }
}
