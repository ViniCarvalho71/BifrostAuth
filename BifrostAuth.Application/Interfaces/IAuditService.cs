using BifrostAuth.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Interfaces
{
    public interface IAuditService
    {
        AuditDto Get(Guid id);
        IQueryable<AuditDto> Get();
        IReadOnlyCollection<AuditDto> GetAll();
        void Save(AuditDto dto);
        void Update(AuditDto dto);
        void Delete(Guid id);
    }
}
