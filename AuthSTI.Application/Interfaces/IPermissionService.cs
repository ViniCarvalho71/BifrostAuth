using AuthSTI.Application.Dtos;
using System;
using System.Collections.Generic;

namespace AuthSTI.Application.Interfaces
{
    public interface IPermissionService
    {
        PermissionDto Get(Guid id);
        IReadOnlyCollection<PermissionDto> GetAll();
        void Save(PermissionDto dto);
        void Update(PermissionDto dto);
        void Delete(Guid id);
    }
}
