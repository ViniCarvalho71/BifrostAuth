using AuthSTI.Application.Dtos;
using AuthSTI.Application.Interfaces;
using AuthSTI.Domain.Repositories;
using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AuthSTI.Application.Sevices
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly IRepository<RolePermission> _repository;

        public RolePermissionService(IRepository<RolePermission> repository)
        {
            _repository = repository;
        }

        public RolePermissionDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"RolePermission com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IReadOnlyCollection<RolePermissionDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(RolePermissionDto dto)
        {
            var entity = new RolePermission
            {
                Id = dto.Id,
                RoleId = dto.RoleId,
                PermissionId = dto.PermissionId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(RolePermissionDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"RolePermission com Id {dto.Id} não encontrado.");

            entity.RoleId = dto.RoleId;
            entity.PermissionId = dto.PermissionId;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"RolePermission com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static RolePermissionDto ToDto(RolePermission entity)
        {
            return new RolePermissionDto
            {
                Id = entity.Id,
                RoleId = entity.RoleId,
                PermissionId = entity.PermissionId
            };
        }
    }
}
