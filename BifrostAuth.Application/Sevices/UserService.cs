using BifrostAuth.Application.Dtos;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Messaging.Abstractions;
using BifrostAuth.Messaging.Events;
using BifrostAuth.Models;
using System.Text.RegularExpressions;

namespace BifrostAuth.Application.Sevices
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _repository;
        private readonly IHasher _passwordHasher;
        private readonly IApplicationService _applicationService;
        private readonly IUserApplicationService _userApplicationService;
        private readonly IEmailService _emailService;
        private readonly IEventBus _eventBus;

        public UserService(IRepository<User> repository, IHasher passwordHasher, IApplicationService applicationService, IUserApplicationService userApplicationService, IEmailService emailService, IEventBus eventBus)
        {
            _repository = repository;
            _passwordHasher = passwordHasher;
            _applicationService = applicationService;
            _userApplicationService = userApplicationService;
            _emailService = emailService;
            _eventBus = eventBus;
        }

        public static void ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new Exception("A senha não pode ser vazia");

            if (password.Length < 8)
                throw new Exception("A senha deve ter pelo menos 8 caracteres");

            if (!Regex.IsMatch(password, "[A-Z]"))
                throw new Exception("A senha deve conter pelo menos uma letra maiúscula");

            if (!Regex.IsMatch(password, "[a-z]"))
                throw new Exception("A senha deve conter pelo menos uma letra minúscula");

            if (!Regex.IsMatch(password, "[0-9]"))
                throw new Exception("A senha deve conter pelo menos um número");

            if (!Regex.IsMatch(password, "[^a-zA-Z0-9]"))
                throw new Exception("A senha deve conter pelo menos um caractere especial");
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
            var user = _repository.Query().FirstOrDefault(x => x.Email == dto.Email);

            if(user != null) throw new Exception($"Já existe um usuário com o email {dto.Email}.");

            ValidatePassword(dto.Password);

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

        public void Register(RegisterUserDto dto)
        {
            try
            {
                var user = _repository.Query().FirstOrDefault(x => x.Email == dto.Email);

                if (user != null) throw new Exception($"Já existe um usuário com o email {dto.Email}.");

                ValidatePassword(dto.Password);

                var application = _applicationService.GetAll().FirstOrDefault(a => a.ClientId == dto.ClientId);

                if (application == null) throw new Exception("Aplicação inválida");

                var entity = new UserDto
                {
                    Login = dto.Login,
                    Email = dto.Email,
                    Password = _passwordHasher.Hash(dto.Password),
                    IsActive = false,
                };

                Save(entity);

                var createdUser = _repository.Query().FirstOrDefault(x => x.Email == dto.Email);

                if (createdUser == null) throw new Exception("Erro ao criar usuário.");

                var userApplication = new UserApplicationDto
                {
                    ApplicationId = application.Id,
                    UserId = createdUser.Id
                };

                _userApplicationService.Save(userApplication);

                _eventBus.PublishAsync(new UserCreatedEvent(
                        createdUser.Id,
                        createdUser.Email,
                        createdUser.Login
                    )
                );
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao registrar usuário: {ex.Message}");
            }
        }
    }
}
