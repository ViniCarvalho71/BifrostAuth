using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Sevices
{
    public class RoleService : IRoleService
    {
        private readonly IRepository<Role> _repository;

        public RoleService(IRepository<Role> repository)
        {
            _repository = repository;
        }

        public RoleDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"Role com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IReadOnlyCollection<RoleDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(RoleDto dto)
        {
            var entity = new Role
            {
                Id = dto.Id,
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(RoleDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"Role com Id {dto.Id} não encontrado.");

            entity.Name = dto.Name;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"Role com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static RoleDto ToDto(Role entity)
        {
            return new RoleDto
            {
                Id = entity.Id,
                Name = entity.Name
            };
        }
    }
}
