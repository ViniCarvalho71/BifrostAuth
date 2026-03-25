using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Interfaces
{
    public interface IRefreshTokenService
    {
        RefreshTokenDto Get(Guid id);
        IQueryable<RefreshTokenDto> Get();
        IReadOnlyCollection<RefreshTokenDto> GetAll();
        void Save(RefreshTokenDto dto);
        void Update(RefreshTokenDto dto);
        void Delete(Guid id);
    }
}
