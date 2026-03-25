using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BifrostAuth.Application.Sevices
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IRepository<RefreshToken> _repository;

        public RefreshTokenService(IRepository<RefreshToken> repository)
        {
            _repository = repository;
        }

        public RefreshTokenDto Get(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"RefreshToken com Id {id} não encontrado.");

            return ToDto(entity);
        }

        public IQueryable<RefreshTokenDto> Get()
        {
            return _repository.Query().Select(x => new RefreshTokenDto
            {
                Id = x.Id,
                UserId = x.UserId,
                Token = x.Token,
                ExpiresAt = x.ExpiresAt,
                RevokedAt = x.RevokedAt,
                ReplacedByToken = x.ReplacedByToken,
                CreatedByIp = x.CreatedByIp
            });
        }

        public IReadOnlyCollection<RefreshTokenDto> GetAll()
        {
            return _repository.Query().Select(ToDto).ToList();
        }

        public void Save(RefreshTokenDto dto)
        {
            var entity = new RefreshToken
            {
                Id = dto.Id,
                UserId = dto.UserId,
                Token = dto.Token,
                ExpiresAt = dto.ExpiresAt,
                RevokedAt = dto.RevokedAt,
                ReplacedByToken = dto.ReplacedByToken,
                CreatedByIp = dto.CreatedByIp,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _repository.Save(entity);
        }

        public void Update(RefreshTokenDto dto)
        {
            var entity = _repository.Get(dto.Id);
            if (entity == null)
                throw new KeyNotFoundException($"RefreshToken com Id {dto.Id} não encontrado.");

            entity.UserId = dto.UserId;
            entity.Token = dto.Token;
            entity.ExpiresAt = dto.ExpiresAt;
            entity.RevokedAt = dto.RevokedAt;
            entity.ReplacedByToken = dto.ReplacedByToken;
            entity.CreatedByIp = dto.CreatedByIp;
            entity.UpdatedAt = DateTime.UtcNow;

            _repository.Update(entity);
        }

        public void Delete(Guid id)
        {
            var entity = _repository.Get(id);
            if (entity == null)
                throw new KeyNotFoundException($"RefreshToken com Id {id} não encontrado.");

            _repository.Delete(entity);
        }

        private static RefreshTokenDto ToDto(RefreshToken entity)
        {
            return new RefreshTokenDto
            {
                Id = entity.Id,
                UserId = entity.UserId,
                Token = entity.Token,
                ExpiresAt = entity.ExpiresAt,
                RevokedAt = entity.RevokedAt,
                ReplacedByToken = entity.ReplacedByToken,
                CreatedByIp = entity.CreatedByIp
            };
        }
    }
}
