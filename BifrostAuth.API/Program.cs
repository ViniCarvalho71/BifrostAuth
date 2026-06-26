using BifrostAuth.Application.Configurations;
using BifrostAuth.Application.Criptography;
using BifrostAuth.Application.Interfaces;
using BifrostAuth.Application.Sevices;
using BifrostAuth.Domain.Repositories;
using BifrostAuth.EmailWorker;
using BifrostAuth.EmailWorker.Consumers;
using BifrostAuth.EmailWorker.Services;
using BifrostAuth.Infrastructure.Configuration;
using BifrostAuth.Infrastructure.Messaging;
using BifrostAuth.Infrastructure.NHibernate.SessionFactory;
using BifrostAuth.Infrastructure.Persistence.Migrations;
using BifrostAuth.Infrastructure.Persistence.Repositories;
using BifrostAuth.Infrastructure.Persistence.Seeds;
using BifrostAuth.Messaging.Abstractions;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.OData;
using NHibernate;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("ConnectionString 'DefaultConnection' não configurada.");

builder.Services.AddBifrostMigrations(builder.Configuration, builder.Environment);
builder.Services.AddBifrostSeeds(builder.Configuration, builder.Environment);

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

var enableSchemaUpdate = builder.Configuration.GetValue<bool>("NHibernate:SchemaUpdateEnabled");
var showSql = builder.Configuration.GetValue<bool?>("NHibernate:ShowSql") ?? builder.Environment.IsDevelopment();
var formatSql = builder.Configuration.GetValue<bool?>("NHibernate:FormatSql") ?? builder.Environment.IsDevelopment();
var batchSize = builder.Configuration.GetValue<int?>("NHibernate:AdoNetBatchSize") ?? 20;

var sessionFactory = NHibernateSessionFactory.Build(
    connectionString,
    enableSchemaUpdate,
    showSql,
    formatSql,
    batchSize);

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
builder.Services.AddScoped<IHasher, PasswordHasher>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<EmailSender>();
builder.Services.AddHostedService<UserCreatedConsumer>();


builder.Services.AddControllers().AddOData(opt =>
    opt.Filter().Select().OrderBy().Count().Expand().SetMaxTop(100)
);
builder.Services.Configure<RabbitMqOptions>(
    builder.Configuration.GetSection("RabbitMQ"));

builder.Services.AddSingleton<RabbitMqConnection>();
builder.Services.AddSingleton<IEventBus, RabbitMqEventBus>();

builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection("Email"));


var app = builder.Build();

await app.RunBifrostMigrationsAsync();
await app.RunBifrostSeedsAsync();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("FrontendPolicy");

app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.MapFallbackToFile("index.html");

await app.RunAsync();
