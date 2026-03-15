using AuthSTI.Application.Dtos;
using AuthSTI.Application.Interfaces;
using AuthSTI.Domain.Repositories;
using AuthSTI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using ApplicationModel = AuthSTI.Models.Application;

namespace AuthSTI.Application.Sevices
{
    public class ApplicationService : IApplicationService
    {
        private readonly IRepository<ApplicationModel> _repository;

        public ApplicationService(IRepository<ApplicationModel> repository)
        {
            _repository = repository;
        }

        public ApplicationDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"Application com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IReadOnlyCollection<ApplicationDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(ApplicationDto dto)
        {
            var entity = new ApplicationModel
            {
                Id = dto.Id,
                Name = dto.Name,
                ClientId = dto.ClientId,
                ClientSecret = dto.ClientSecret,
                RedirectUrl = dto.RedirectUrl,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(ApplicationDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"Application com Id {dto.Id} não encontrado.");

            entity.Name = dto.Name;
            entity.ClientId = dto.ClientId;
            entity.ClientSecret = dto.ClientSecret;
            entity.RedirectUrl = dto.RedirectUrl;
            entity.IsActive = dto.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"Application com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static ApplicationDto ToDto(ApplicationModel entity)
        {
            return new ApplicationDto
            {
                Id = entity.Id,
                Name = entity.Name,
                ClientId = entity.ClientId,
                ClientSecret = entity.ClientSecret,
                RedirectUrl = entity.RedirectUrl,
                IsActive = entity.IsActive
            };
        }
    }
}
