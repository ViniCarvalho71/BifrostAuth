# BifrostAuth.Web

SPA (React + Vite) usada como **tela de autorização** e **painel administrativo** do BifrostAuth.

## Fluxo `/authorize` → `/callback`

1. A aplicação cliente redireciona o usuário para:

```text
/authorize?client_id=<CLIENT_ID>&response_type=code&redirect_uri=<REDIRECT_URI>
```

2. A página de login (`/authorize`) autentica chamando a API (`POST /api/auth`).
3. Em caso de sucesso, redireciona para:

```text
<CALLBACK_URL>?token=<JWT>
```

4. A página `/callback` salva o token e valida antes de liberar o acesso às rotas protegidas.

## Validação do token (como está no projeto)

A validação acontece no frontend em `src/Services/authService.ts` e verifica:

- token expiração (`exp`)
- audience (`aud`) igual ao `CLIENT_ID`
- assinatura HS256 com `VITE_JWT_SECRET`

> Observação: isso exige ter o segredo no browser. Para produção, a recomendação é validar no backend do cliente
> (e não expor `Jwt__Key` no frontend).

## Variáveis de ambiente

Arquivo: `.env`

- `VITE_API_URL`: base URL da API (ex.: `http://localhost:5249`)
- `CLIENT_ID`: `client_id` cadastrado em `Application` (ex.: `bifrost_app_8080`)
- `REDIRECT_URI`: URL do callback do cliente (ex.: `http://localhost:8080/callback`)
- `VITE_JWT_SECRET`: mesma chave do servidor (`Jwt__Key`) para validar assinatura (apenas para demo)

## Rodar localmente

```bash
npm install
npm run dev
```
