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

### Novo fluxo (via URL + callback)

O login é feito no estilo **redirect**:

1. Sua aplicação redireciona o usuário para a tela de autorização do BifrostAuth (`/authorize`) informando o `client_id` e um `redirect_uri`.
2. O usuário autentica (e-mail/senha).
3. Em caso de sucesso, o BifrostAuth redireciona para o **endpoint de callback** informado, enviando o JWT na query string:

`GET <callback_url>?token=<JWT>`

4. Sua aplicação (no callback) extrai o `token`, salva com segurança e valida o JWT.
5. Se o token estiver inválido/expirado, a aplicação deve redirecionar novamente para o `/authorize`.

#### Exemplo de URL de autorização

> Ajuste o host/base para onde o BifrostAuth está publicado.

```text
GET https://<BIFROST_AUTH_HOST>/authorize?client_id=bifrost_app_8080&response_type=code&redirect_uri=http://localhost:8080/callback
```

#### Regras de redirect

O `redirect_uri` é validado contra o `RedirectUrl` cadastrado na `Application` do `client_id`.
No frontend do BifrostAuth, a validação é feita garantindo:

- mesmo `origin` (protocolo + host + porta)
- e que o `path` do `redirect_uri` seja igual ao cadastrado ou um subcaminho permitido

Isso evita que um `client_id` válido redirecione para um domínio não autorizado.

> Observação: o projeto usa o caminho fixo `/callback` para finalizar o fluxo.
> Se você informar `redirect_uri=http://localhost:8080`, o redirecionamento final será `http://localhost:8080/callback?token=...`.
> Se você informar `redirect_uri=http://localhost:8080/callback`, o redirecionamento final será `http://localhost:8080/callback?token=...`.

---

### O que validar no token (implementação do consumidor)

O JWT emitido pelo BifrostAuth é assinado com **HS256 (HMAC-SHA256)** e expira em **1 hora**.

Validações mínimas recomendadas:

1. **Estrutura JWT**: 3 partes (`header.payload.signature`).
2. **Assinatura**: validar com a mesma chave do servidor (`Jwt__Key`).
3. **Expiração (`exp`)**: rejeitar token expirado.
4. **Audience (`aud`)**: deve ser igual ao seu `client_id`.
5. (Opcional, recomendado) **Issuer (`iss`)**: deve ser igual a `Jwt__Issuer`.

Claims emitidas no token:

- `sub` (id do usuário)
- `email`
- `name` (login)
- `role` (uma ou mais)
- `permission` (uma ou mais)

#### Exemplo (C#) — validar JWT recebido no callback

```csharp
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

bool ValidateBifrostJwt(string token, string jwtKey, string issuer, string clientId)
{
    var handler = new JwtSecurityTokenHandler();
    var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

    handler.ValidateToken(
        token,
        new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),

            ValidateIssuer = true,
            ValidIssuer = issuer,

            ValidateAudience = true,
            ValidAudience = clientId,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        },
        out _
    );

    return true;
}
```

#### Exemplo (SPA) — implementar o `/callback`

```ts
// /callback
const params = new URLSearchParams(window.location.search);
const token = (params.get("token") ?? "").trim();

if (!token) {
  window.location.assign("/login");
}

// Salve onde fizer sentido para o seu app (localStorage, cookie, state, etc.)
localStorage.setItem("token", token);

// Em seguida valide (assinatura + exp + aud + iss) e redirecione:
window.location.assign("/app");
```

#### Usando o token nas requisições

Após validar, envie o JWT como Bearer token:

```http
Authorization: Bearer <JWT>
```

#### Importante (segurança)

- Evite validar HS256 no **browser** usando a chave secreta, porque isso exige expor o segredo no frontend.
  O projeto `BifrostAuth.Web` faz essa validação client-side apenas como exemplo/demonstração.
- Em aplicações reais, prefira:
  - validar no backend da sua aplicação; e/ou
  - trocar o fluxo para **authorization code** (enviar `code` no callback e trocar por token no servidor);
  - armazenar token em **cookie HttpOnly** ou outra estratégia compatível com seu cenário.

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

> Esse endpoint é usado pela tela `/authorize` para gerar o JWT. Se você estiver integrando um cliente externo,
> normalmente você só precisa redirecionar para `/authorize` e tratar o `/callback`.

`POST /api/Auth`

```json
{
  "email": "usuario@dominio.com",
  "password": "senha",
  "clientId": "bifrost_app_8080"
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

## ☁️ Deploy na AWS (Produção)

O projeto está preparado para ser escalado e hospedado na AWS (ex: ECS, EKS, App Runner ou Elastic Beanstalk), com separação de responsabilidades entre Frontend, Backend e Banco de Dados.

### 1. Banco de Dados (Amazon RDS)
Em produção, utilize um banco gerenciado como o **Amazon RDS (PostgreSQL)** em vez de container Docker:
- Ao criar a instância no RDS, anote o `Endpoint`, `Port`, `Username` e `Password`.
- O schema será criado via migrations do FluentMigrator no startup do backend (ou CI/CD).

### 2. Backend (.NET API)
Utilize o `Dockerfile.backend` para construir a imagem da API:
```bash
docker build -f Dockerfile.backend -t bifrostauth-backend:latest .
```
No ambiente da AWS (Task Definition do ECS, por exemplo), configure as variáveis de ambiente essenciais:
- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection="Server=<RDS_ENDPOINT>;Port=5432;Database=BifrostAuth;Username=postgres;Password=<RDS_PASSWORD>"`
- `Jwt__Key="<SUA_CHAVE_FORTE>"`
- `Migrations__RunOnStartup=true` (Opcional: ative apenas na primeira subida ou em pipeline de CI/CD para versionar o schema)

### 3. Frontend (React + Vite)
Utilize o `Dockerfile.frontend` para construir a imagem do SPA servido por NGINX:
```bash
docker build -f Dockerfile.frontend -t bifrostauth-frontend:latest .
```
> **Nota:** Certifique-se de configurar as variáveis de ambiente (ex: `VITE_API_URL`) antes do build, pois variáveis do frontend React são injetadas em tempo de build, ou utilize técnicas de injeção em runtime (window.env).

### Observações Gerais
- Faça push das imagens geradas para o **Amazon ECR**.
- Seeds ficam desabilitados por padrão em produção; habilite (`Seed__Admin__Enabled=true`) com senha (`Seed__Admin__Password`) se quiser criar o primeiro admin automaticamente.

## 🐳 Rodar com Docker (modo "dev" local)

O `docker-compose.yml` padrão usa o arquivo `.env.bifrostauth`, que está configurado com `ASPNETCORE_ENVIRONMENT=Development`.

- Subir dev:
  - `docker compose up -d --build`
- Nesse modo, se `Seed__Admin__Enabled=true` e `Seed__Application__Enabled=true`, ele cria (idempotente) o usuário admin e a application padrão.

## 📫 Contato

Se este projeto chamou sua atenção, fique à vontade para entrar em contato pelo GitHub.
