using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Models;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using ApplicationModel = BifrostAuth.Models.Application;

namespace BifrostAuth.Application.Sevices
{
    public class UserApplicationService : IUserApplicationService
    {
        private readonly IRepository<UserApplication> _repository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<ApplicationModel> _applicationRepository;

        public UserApplicationService(
            IRepository<UserApplication> repository,
            IRepository<User> userRepository,
            IRepository<ApplicationModel> applicationRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
            _applicationRepository = applicationRepository;
        }

        public UserApplicationDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"UserApplication com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IReadOnlyCollection<UserApplicationDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(UserApplicationDto dto)
        {
            ValidateReferences(dto.UserId, dto.ApplicationId);

            var entity = new UserApplication
            {
                Id = dto.Id,
                UserId = dto.UserId,
                ApplicationId = dto.ApplicationId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(UserApplicationDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"UserApplication com Id {dto.Id} não encontrado.");

            ValidateReferences(dto.UserId, dto.ApplicationId);

            entity.UserId = dto.UserId;
            entity.ApplicationId = dto.ApplicationId;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"UserApplication com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static UserApplicationDto ToDto(UserApplication entity)
        {
            return new UserApplicationDto
            {
                Id = entity.Id,
                UserId = entity.UserId,
                ApplicationId = entity.ApplicationId
            };
        }

        private void ValidateReferences(Guid userId, Guid applicationId)
        {
            if (userId == Guid.Empty)
                throw new ArgumentException("UserId inválido.");

            if (applicationId == Guid.Empty)
                throw new ArgumentException("ApplicationId inválido.");

            if (_userRepository.Get(userId) == null)
                throw new KeyNotFoundException($"User com Id {userId} não encontrado.");

            if (_applicationRepository.Get(applicationId) == null)
                throw new KeyNotFoundException($"Application com Id {applicationId} não encontrado.");
        }
    }
}
