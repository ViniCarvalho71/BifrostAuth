using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;

namespace BifrostAuth.Application.Interfaces
{
    public interface IAuditService
    {
        AuditDto Get(Guid id);
        IReadOnlyCollection<AuditDto> GetAll();
        void Save(AuditDto dto);
        void Update(AuditDto dto);
        void Delete(Guid id);
    }
}
