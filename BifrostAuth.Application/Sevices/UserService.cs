using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Sevices
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _repository;
        private readonly IPasswordHash _passwordHasher;

        public UserService(IRepository<User> repository, IPasswordHash passwordHasher)
        {
            _repository = repository;
            _passwordHasher = passwordHasher;
        }

        public UserDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"User com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IQueryable<UserDto> Get()
        {
            return _repository.Query().Select(x => new UserDto
            {
                Id = x.Id,
                Login = x.Login,
                Email = x.Email,
                Password = x.Password,
                IsActive = x.IsActive
            });
        }

        public IReadOnlyCollection<UserDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(UserDto dto)
        {
            var entity = new User
            {
                Id = dto.Id,
                Login = dto.Login,
                Email = dto.Email,
                Password = _passwordHasher.Hash(dto.Password),
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(UserDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"User com Id {dto.Id} não encontrado.");

            entity.Login = dto.Login;
            entity.Email = dto.Email;
            entity.IsActive = dto.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"User com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static UserDto ToDto(User entity)
        {
            return new UserDto
            {
                Id = entity.Id,
                Login = entity.Login,
                Email = entity.Email,
                Password = entity.Password,
                IsActive = entity.IsActive
            };
        }
    }
}
