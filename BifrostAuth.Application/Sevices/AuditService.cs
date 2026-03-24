using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Sevices
{
    public class AuditService : IAuditService
    {
        private readonly IRepository<Audit> _repository;

        public AuditService(IRepository<Audit> repository)
        {
            _repository = repository;
        }

        public AuditDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"Audit com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IReadOnlyCollection<AuditDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(AuditDto dto)
        {
            var entity = new Audit
            {
                Id = dto.Id,
                UserId = dto.UserId,
                Action = dto.Action,
                PreviouValue = dto.PreviouValue,
                NewValue = dto.NewValue,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(AuditDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"Audit com Id {dto.Id} não encontrado.");

            entity.UserId = dto.UserId;
            entity.Action = dto.Action;
            entity.PreviouValue = dto.PreviouValue;
            entity.NewValue = dto.NewValue;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"Audit com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static AuditDto ToDto(Audit entity)
        {
            return new AuditDto
            {
                Id = entity.Id,
                UserId = entity.UserId,
                Action = entity.Action,
                PreviouValue = entity.PreviouValue,
                NewValue = entity.NewValue
            };
        }
    }
}
