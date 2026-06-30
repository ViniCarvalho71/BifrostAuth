using BifrostAuth.Application.Configurations;
using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace BifrostAuth.Application.Sevices
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<User> _repository;
        private readonly JwtSettings _jwtSettings;
        private readonly IHasher _hasher;
        private readonly IRepository<Models.Application> _applicationRepository;
        private readonly IRepository<RefreshToken> _refreshTokenRepository;

        public AuthService(
            IRepository<User> repository,
            IOptions<JwtSettings> jwtOptions,
            IHasher hasher,
            IRepository<Models.Application> applicationRepository,
            IRepository<RefreshToken> refreshTokenRepository)
        {
            _repository = repository;
            _jwtSettings = jwtOptions.Value;
            _hasher = hasher;
            _applicationRepository = applicationRepository;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public string GenerateToken(string userId, string email,string login, IList<string> roles, IList<string> permissions, string client_id)
        {

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtSettings.Key)
            );

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Name, login),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim("role", role));
            }

            // Permissions
            foreach (var permission in permissions)
            {
                claims.Add(new Claim("permission", permission));
            }

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: client_id,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private AuthDto CreateSession(User user, Models.Application application)
        {
            var roles = user.UserRoles
                .Select(ur => ur.Role.Name)
                .ToList();

            var permissions = user.UserRoles
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.Name)
                .Distinct()
                .ToList();

            RevokeRefreshTokens(user.Id, application.Id);

            string jwtToken = GenerateToken(
                user.Id.ToString(),
                user.Email,
                user.Login,
                roles,
                permissions,
                application.ClientId);

            string refreshToken = GenerateRefreshToken();

            _refreshTokenRepository.Save(new RefreshToken
            {
                Token = ComputeRefreshTokenHash(refreshToken),
                UserId = user.Id,
                ApplicationId = application.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,

            });

            return new AuthDto
            {
                Token = jwtToken,
                RefreshToken = refreshToken
            };
        }

        private string ComputeRefreshTokenHash(string refreshToken)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(refreshToken);

            byte[] bytes = Encoding.UTF8.GetBytes(refreshToken);
            byte[] hash = SHA256.HashData(bytes);

            return Convert.ToHexString(hash);
        }

        private string GenerateRefreshToken()
        {
            Span<byte> bytes = stackalloc byte[32];

            RandomNumberGenerator.Fill(bytes);

            return WebEncoders.Base64UrlEncode(bytes);
        }

        private void RevokeRefreshTokens(Guid userId, Guid applicationId)
        {
           _refreshTokenRepository.Query()
                .Where(rt => rt.ExpiresAt > DateTime.UtcNow && rt.RevokedAt == null && rt.UserId == userId && rt.ApplicationId == applicationId)
                .ToList()
                .ForEach(rt =>
                {
                    rt.RevokedAt = DateTime.UtcNow;
                    _refreshTokenRepository.Update(rt);
                });
        }
        public AuthDto Login(string email, string password, string client_id)
        {
                var application = _applicationRepository.Query()
                    .FirstOrDefault(a => a.ClientId == client_id && a.IsActive);

                if (application == null)
                {
                    throw new Exception("Application inválida");
                }

                var user = _repository.Query().FirstOrDefault(u => u.Email == email);
                if (user == null || !_hasher.Verify(user.Password, password))
                {
                    throw new Exception("Email ou senha inválidos");
                }

                var hasAccess = user.UserApplications
                    .Any(ua => ua.ApplicationId == application.Id);

                if (!hasAccess)
                {
                    throw new Exception("Usuário não tem acesso a essa aplicação");
                }

                return CreateSession(user, application);
        }

        public AuthDto Refresh(string refreshToken)
        {
            string refreshTokenHash = ComputeRefreshTokenHash(refreshToken);

            RefreshToken refreshTokenEntity = _refreshTokenRepository
                .Query()
                .FirstOrDefault(rt =>
                    rt.Token == refreshTokenHash &&
                    rt.RevokedAt == null);

            if (refreshTokenEntity == null)
                throw new Exception("Refresh token inválido ou expirado");

            var user = _repository.Get(refreshTokenEntity.UserId);

            if (user == null)
                throw new Exception("Usuário não encontrado");

            var application = _applicationRepository.Get(refreshTokenEntity.ApplicationId);

            if (application == null || !application.IsActive)
                throw new Exception("Application inválida");

            return CreateSession(user, application);
        }

        public void ConfirmEmail(string token)
        {
            throw new NotImplementedException("Método ConfirmEmail não implementado.");
        }
    }
}
