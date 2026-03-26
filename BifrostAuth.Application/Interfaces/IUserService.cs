using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Interfaces
{
    public interface IUserService
    {
        UserDto Get(Guid id);
        IQueryable<UserDto> Get();
        IReadOnlyCollection<UserDto> GetAll();
        void Save(UserDto dto);
        void Register(RegisterUserDto dto);
        void Update(UserDto dto);
        void Delete(Guid id);
    }
}
