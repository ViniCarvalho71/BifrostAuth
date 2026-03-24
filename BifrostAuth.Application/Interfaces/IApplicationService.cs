using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;

namespace BifrostAuth.Application.Interfaces
{
    public interface IApplicationService
    {
        ApplicationDto Get(Guid id);
        IReadOnlyCollection<ApplicationDto> GetAll();
        void Save(ApplicationDto dto);
        void Update(ApplicationDto dto);
        void Delete(Guid id);
    }
}
