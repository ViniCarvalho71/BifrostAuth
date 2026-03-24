using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;

namespace BifrostAuth.Application.Interfaces
{
    public interface IUserApplicationService
    {
        UserApplicationDto Get(Guid id);
        IReadOnlyCollection<UserApplicationDto> GetAll();
        void Save(UserApplicationDto dto);
        void Update(UserApplicationDto dto);
        void Delete(Guid id);
    }
}
