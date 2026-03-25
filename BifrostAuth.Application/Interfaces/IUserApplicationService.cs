using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Interfaces
{
    public interface IUserApplicationService
    {
        UserApplicationDto Get(Guid id);
        IQueryable<UserApplicationDto> Get();
        IReadOnlyCollection<UserApplicationDto> GetAll();
        void Save(UserApplicationDto dto);
        void Update(UserApplicationDto dto);
        void Delete(Guid id);
    }
}
