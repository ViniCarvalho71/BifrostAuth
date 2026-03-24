using BifrostAuth.Application.Configurations;
using BifrostAuth.Application.Criptografy;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Application.Sevices;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.Infrastructure.NHibernate.SessionFactory;
using BifrostAuth.Infrastructure.Persistence.Repositories;
using NHibernate;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("ConnectionString 'DefaultConnection' não configurada.");

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

var sessionFactory = NHibernateSessionFactory.Build(connectionString);

builder.Services.AddSingleton(sessionFactory);
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped(factory =>
{
    var sessionFactory = factory.GetRequiredService<ISessionFactory>();
    return sessionFactory.OpenSession();
});
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IUserApplicationService, UserApplicationService>();
builder.Services.AddScoped<IRolePermissionService, RolePermissionService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPasswordHash, PasswordHasher>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
