using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Sevices
{
    public class PermissionService : IPermissionService
    {
        private readonly IRepository<Permission> _repository;

        public PermissionService(IRepository<Permission> repository)
        {
            _repository = repository;
        }

        public PermissionDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"Permission com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IReadOnlyCollection<PermissionDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(PermissionDto dto)
        {
            var entity = new Permission
            {
                Id = dto.Id,
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(PermissionDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"Permission com Id {dto.Id} não encontrado.");

            entity.Name = dto.Name;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"Permission com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static PermissionDto ToDto(Permission entity)
        {
            return new PermissionDto
            {
                Id = entity.Id,
                Name = entity.Name
            };
        }
    }
}
