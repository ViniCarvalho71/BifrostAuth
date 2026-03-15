using AuthSTI.Application.Dtos;
using System;
using System.Collections.Generic;

namespace AuthSTI.Application.Interfaces
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
