using AuthSTI.Application.Dtos;
using AuthSTI.Application.Interfaces;
using AuthSTI.Domain.Repositories;
using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AuthSTI.Application.Sevices
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IRepository<UserRole> _repository;

        public UserRoleService(IRepository<UserRole> repository)
        {
            _repository = repository;
        }

        public UserRoleDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"UserRole com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IReadOnlyCollection<UserRoleDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(UserRoleDto dto)
        {
            var entity = new UserRole
            {
                Id = dto.Id,
                UserId = dto.UserId,
                RoleId = dto.RoleId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(UserRoleDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"UserRole com Id {dto.Id} não encontrado.");

            entity.UserId = dto.UserId;
            entity.RoleId = dto.RoleId;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"UserRole com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static UserRoleDto ToDto(UserRole entity)
        {
            return new UserRoleDto
            {
                Id = entity.Id,
                UserId = entity.UserId,
                RoleId = entity.RoleId
            };
        }
    }
}
