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

A inicialização do NHibernate está com `SchemaUpdate`, evitando recriação do banco a cada execução.

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

## 📫 Contato

Se este projeto chamou sua atenção, fique à vontade para entrar em contato pelo GitHub.
