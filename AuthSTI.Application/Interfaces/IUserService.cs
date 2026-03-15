using AuthSTI.Application.Dtos;
using System;
using System.Collections.Generic;

namespace AuthSTI.Application.Interfaces
{
    public interface IUserService
    {
        UserDto Get(Guid id);
        IReadOnlyCollection<UserDto> GetAll();
        void Save(UserDto dto);
        void Update(UserDto dto);
        void Delete(Guid id);
    }
}
