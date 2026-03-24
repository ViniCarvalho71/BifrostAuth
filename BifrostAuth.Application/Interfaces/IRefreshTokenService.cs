using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;

namespace BifrostAuth.Application.Interfaces
{
    public interface IRefreshTokenService
    {
        RefreshTokenDto Get(Guid id);
        IReadOnlyCollection<RefreshTokenDto> GetAll();
        void Save(RefreshTokenDto dto);
        void Update(RefreshTokenDto dto);
        void Delete(Guid id);
    }
}
