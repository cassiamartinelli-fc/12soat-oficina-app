# 12SOAT - Oficina Mecânica - Application

Aplicação principal NestJS com Clean Architecture (DDD).

## Stack
- NestJS + TypeScript
- Neon PostgreSQL
- Docker
- Kubernetes
- JWT Authentication

## Estrutura
```
src/                 - Código NestJS (Clean Architecture)
k8s/                 - Manifests Kubernetes
.github/workflows/   - CI/CD
```

## Arquitetura

### Domain Driven Design (DDD)
```
src/
├── application/     - DTOs e Use Cases
├── domain/          - Entidades e Value Objects
├── infrastructure/  - Persistência e Repositórios
├── presentation/    - Controllers REST
└── shared/          - Código compartilhado
```

## Deploy Local

```bash
# Instalar dependências
yarn install

# Rodar em desenvolvimento
yarn start:dev

# Acessar Swagger
http://localhost:3000/api-docs
```

## Deploy Kubernetes

```bash
# Build da imagem
docker build -t oficina-app:latest .

# Aplicar manifests
kubectl apply -f k8s/

# Port forward
kubectl port-forward svc/oficina-api 3000:80
```

## Secrets Necessários

- `NEON_DATABASE_URL` - Connection string do Neon PostgreSQL
- `JWT_SECRET` - Segredo para geração de JWT
- `NEWRELIC_LICENSE_KEY` - License key do New Relic

## Funcionalidades (Fase 2)

- Abertura de Ordem de Serviço
- Consulta de status da OS
- Aprovação de orçamento
- Listagem de ordens de serviço
- Atualização de status da OS

## APIs Protegidas

Rotas que exigem autenticação JWT via Kong Gateway:
- `POST /ordens-servico`
- `GET /ordens-servico/:id`
- `PATCH /ordens-servico/:id/aprovacao`
- `PATCH /ordens-servico/:id/status`
