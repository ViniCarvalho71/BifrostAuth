# BifrostAuth 🔐

API de autenticação e autorização desenvolvida com foco em **arquitetura limpa**, **segurança** e **escalabilidade**.

> Projeto ideal para demonstrar domínio de backend em `C#`, `ASP.NET Core`, `JWT` e modelagem de acesso baseada em papéis e permissões.

---

## 🎯 Sobre o projeto

O `BifrostAuth` é uma API para controle de identidade e acesso, com:

- autenticação via `JWT`
- autorização por `roles` e `permissions`
- controle de acesso por aplicação (`client_id`)
- estrutura em camadas (`API`, `Application`, `Domain`, `Infrastructure`)
- persistência relacional com `PostgreSQL` + `NHibernate`

Este projeto evidencia capacidade de construir uma solução real de autenticação com separação de responsabilidades e foco em manutenção.

---

## 🧠 O que este projeto demonstra para recrutadores

- Modelagem de domínio e relacionamento entre entidades (`User`, `Role`, `Permission`, `Application`)
- Implementação de serviços com regras de negócio desacopladas dos controllers
- Padrão de `Repository` genérico com `NHibernate`
- Geração de token com claims customizadas (`role`, `permission`)
- Organização de código voltada para evolução e testes
- Correção de problemas reais de produção (ex.: evitar reset de schema no startup)

---

## 🏗️ Arquitetura da solução

### `BifrostAuth.API`
Camada de entrada HTTP (controllers, configuração da aplicação e DI).

### `BifrostAuth.Application`
Regras de negócio, DTOs, interfaces e serviços.

### `BifrostAuth.Domain`
Entidades e contratos centrais do domínio.

### `BifrostAuth.Infrastructure`
Mapeamentos NHibernate, sessão de banco e implementação do repositório.

---

## ⚙️ Stack técnica

- `.NET 10`
- `ASP.NET Core Web API`
- `NHibernate` + `FluentNHibernate`
- `PostgreSQL` (`Npgsql`)
- `JWT` (`System.IdentityModel.Tokens.Jwt`)
- `BCrypt` para hashing de senha
- `OpenAPI` + `Scalar` para documentação

---

## 🔐 Fluxo de autenticação

1. Cliente envia `email`, `password` e `clientId`.
2. API valida aplicação ativa e vínculo do usuário com a aplicação.
3. API carrega `roles` e `permissions` do usuário.
4. API retorna JWT com claims:
   - `sub`
   - `email`
   - `name`
   - `role`
   - `permission`

---

## 📌 Endpoints principais

Base route: `api/[controller]`

- `AuthController`
- `UsersController`
- `RolesController`
- `PermissionsController`
- `ApplicationsController`
- `UserRolesController`
- `UserApplicationController`
- `RolePermissionsController`
- `RefreshTokensController`
- `AuditsController`

Os módulos seguem padrão de CRUD (`GET`, `GET {id}`, `POST`, `PUT`, `DELETE`).

### Exemplo de login

`POST /api/Auth`

```json
{
  "email": "usuario@dominio.com",
  "password": "senha",
  "clientId": "connect_sti_67"
}
```

---

## 🗄️ Banco de dados e evolução de schema

O projeto agora suporta **migrations profissionais com FluentMigrator**.

- As migrations ficam em `BifrostAuth.Infrastructure/Persistence/Migrations`
- A tabela de controle de versões é `VersionInfo` (padrão do FluentMigrator)
- Por padrão, as migrations rodam automaticamente no startup (configurável)

### Seeds (ADMIN)

Existe um seed idempotente para criar:

- Role `ADMIN`
- Usuário admin
- Vínculo `UserRoles`
- Application padrão (`client_id=bifrost_app_8080`)
- Vínculo `UserApplications` (admin → application)

Seeds ficam em `BifrostAuth.Infrastructure/Persistence/Seeds`.

Por segurança:

- Em `Development`, o seed pode rodar automaticamente (se você não desabilitar)
- Em `Production`, habilite explicitamente e informe a senha via env var

### Variáveis de ambiente (exemplo)

Veja `.env.bifrostauth` para o exemplo completo. Principais chaves:

- `Migrations__RunOnStartup=true|false`
- `Migrations__Tags__0=Development` (opcional, para rodar apenas migrations taggeadas)
- `NHibernate__SchemaUpdateEnabled=true|false` (recomendado `false` quando usar FluentMigrator)
- `Seed__Admin__Enabled=true|false`
- `Seed__Admin__Password=<senha forte>`

---

## 🚀 Como executar localmente

Na raiz do repositório:

```bash
dotnet restore
dotnet build
dotnet run --project BifrostAuth.API
```

Configuração em `BifrostAuth.API/appsettings.Development.json`:

```json
{
  "Jwt": {
    "Key": "<sua-chave-forte>",
    "Issuer": "BifrostAuth",
    "Audience": "BifrostAuth"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=BifrostAuth;Username=postgres;Password=1234"
  }
}
```
---

## 🐳 Rodar com Docker (modo "produção")

Para subir o stack de forma mais próxima de produção (sem expor Postgres na sua máquina host e com env separado):

1. Copie o exemplo de env:
  - copie `.env.bifrostauth.prod.example` → `.env.bifrostauth.prod`
  - ajuste `POSTGRES_PASSWORD`, `ConnectionStrings__DefaultConnection` e `Jwt__Key`
2. Suba com:
  - `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`

Observações:

- Seeds ficam desabilitados por padrão em produção; habilite apenas se quiser bootstrap automático.
- `NHibernate__SchemaUpdateEnabled` deve ficar `false` quando FluentMigrator controla o schema.

## 🐳 Rodar com Docker (modo "dev")

O `docker-compose.yml` padrão usa o arquivo `.env.bifrostauth`, que está configurado com `ASPNETCORE_ENVIRONMENT=Development`.

- Subir dev:
  - `docker compose up -d --build`
- Nesse modo, se `Seed__Admin__Enabled=true` e `Seed__Application__Enabled=true`, ele cria (idempotente) o usuário admin e a application padrão.

## 📫 Contato

Se este projeto chamou sua atenção, fique à vontade para entrar em contato pelo GitHub.
