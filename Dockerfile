# Build do frontend (React + Vite)
FROM node:22-alpine AS frontend-build
WORKDIR /src/BifrostAuth.Web
COPY BifrostAuth.Web/package*.json ./
RUN npm ci
COPY BifrostAuth.Web/ ./
RUN npm run build

# Build e publish do backend (.NET 10)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src

# Copia apenas arquivos de projeto para aproveitar cache de restore
COPY BifrostAuth.API/BifrostAuth.API.csproj BifrostAuth.API/
COPY BifrostAuth.Application/BifrostAuth.Application.csproj BifrostAuth.Application/
COPY BifrostAuth.Domain/BifrostAuth.Domain.csproj BifrostAuth.Domain/
COPY BifrostAuth.Infrastructure/BifrostAuth.Infrastructure.csproj BifrostAuth.Infrastructure/

RUN dotnet restore BifrostAuth.API/BifrostAuth.API.csproj

# Copia o restante do código e gera publish
COPY . ./
RUN dotnet publish BifrostAuth.API/BifrostAuth.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# Imagem final única (backend servindo a SPA via wwwroot)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends libgssapi-krb5-2 \
	&& rm -rf /var/lib/apt/lists/*

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

COPY --from=backend-build /app/publish ./
COPY --from=frontend-build /src/BifrostAuth.Web/dist ./wwwroot

ENTRYPOINT ["dotnet", "BifrostAuth.API.dll"]
