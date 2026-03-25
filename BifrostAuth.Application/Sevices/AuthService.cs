using BifrostAuth.Application.Configurations;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

namespace BifrostAuth.Application.Sevices
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<User> _repository;
        private readonly JwtSettings _jwtSettings;
        private readonly IPasswordHash _passwordHasher;
        private readonly IRepository<Models.Application> _applicationRepository;

        public AuthService(
            IRepository<User> repository,
            IOptions<JwtSettings> jwtOptions,
            IPasswordHash passwordHasher,
            IRepository<Models.Application> applicationRepository)
        {
            _repository = repository;
            _jwtSettings = jwtOptions.Value;
            _passwordHasher = passwordHasher;
            _applicationRepository = applicationRepository;
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
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public string Login(string email, string password, string client_id)
        {
            try
            {
                var application = _applicationRepository.Query()
                    .FirstOrDefault(a => a.ClientId == client_id && a.IsActive);

                if (application == null)
                {
                    throw new Exception("Application inválida");
                }

                var user = _repository.Query().FirstOrDefault(u => u.Email == email);
                if (user == null || !_passwordHasher.Verify(user.Password, password))
                {
                    throw new Exception("Email ou senha inválidos");
                }

                var hasAccess = user.UserApplications
                    .Any(ua => ua.ApplicationId == application.Id);

                if (!hasAccess)
                {
                    throw new Exception("Usuário não tem acesso a essa aplicação");
                }

                var roles = user.UserRoles
                    .Select(ur => ur.Role.Name)
                    .ToList();

                var permissions = user.UserRoles
                    .SelectMany(ur => ur.Role.RolePermissions)
                    .Select(rp => rp.Permission.Name)
                    .Distinct()
                    .ToList();

                string jwt_token = GenerateToken(user.Id.ToString(), user.Email,user.Login, roles, permissions, client_id);

                return jwt_token;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
