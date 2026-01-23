# Oficina Mecânica — Aplicação Principal

Aplicação NestJS (Clean Architecture / DDD) para gestão de oficina mecânica. Este README é o ponto de partida para rodar o projeto completo (4 repositórios).

## 📋 Índice

- [🔗 Links Úteis](#-links-úteis)
- [🎯 Propósito](#-propósito)
- [🛠️ Tecnologias](#️-tecnologias)
- [📁 Estrutura DDD](#-estrutura-ddd)
- [🚀 Provisionamento e Deploy](#-provisionamento-e-deploy-da-aplicação)
- [⚙️ Comandos Essenciais](#️-comandos-essenciais)
- [🔐 CI/CD — Secrets](#-cicd--secrets-e-permissões)
- [📊 Arquitetura](#-arquitetura)
- [🔗 APIs Principais](#-apis-principais)
- [📈 Observabilidade](#-observabilidade)
- [📝 Licença](#-licença)

## 🔗 Links Úteis

### Deploy Ativo
- **Kong Gateway (API):** Execute workflow `Terraform AWS` → `output` para obter `<KONG_URL>`
- **Swagger/API Docs:** `<KONG_URL>/api-docs`
- **Health Check:** `<KONG_URL>/health`
- **New Relic APM:** https://one.newrelic.com

### Documentação
- **Vídeo de Apresentação:** [Vídeo Grupo 70](https://youtu.be/5lpqyKaiK8Q)
- **Postman Collection:** [Oficina Mecânica API](https://www.postman.com/cassia-martinelli-9397607/workspace/cassia-s-workspace/request/46977418-4a758cc9-d08a-4ca6-ab97-b522149755d5?action=share&creator=46977418&ctx=documentation)
- **Arquitetura:** [Documentação arquitetural](https://github.com/cassiamartinelli-fc/12soat-oficina-app/blob/main/documentacao-arquitetural.pdf)

### Repositórios
- [12soat-oficina-app](https://github.com/cassiamartinelli-fc/12soat-oficina-app) — Aplicação principal
- [12soat-oficina-lambda-auth](https://github.com/cassiamartinelli-fc/12soat-oficina-lambda-auth) — Lambda autenticação
- [12soat-oficina-infra-k8s](https://github.com/cassiamartinelli-fc/12soat-oficina-infra-k8s) — Infraestrutura AWS
- [12soat-oficina-infra-database](https://github.com/cassiamartinelli-fc/12soat-oficina-infra-database) — Banco de dados

## 🎯 Propósito

API REST para gerenciamento de ordens de serviço, clientes, veículos, peças e serviços de oficina mecânica. Implementa autenticação JWT via Kong API Gateway e observabilidade com New Relic.

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js com TypeScript
- **TypeORM** - ORM para PostgreSQL
- **Neon PostgreSQL** - Banco de dados gerenciado
- **Kong Gateway** - API Gateway com autenticação JWT
- **New Relic** - APM e observabilidade
- **Kubernetes** - Orquestração de containers
- **GitHub Actions** - CI/CD automático

## 📁 Estrutura DDD

```
src/
├── application/     - DTOs, Use Cases e Mappers
├── domain/          - Entidades e Value Objects
├── infrastructure/  - Repositórios e Persistência
├── presentation/    - Controllers REST
└── shared/          - Services e Exceções
```

## 🚀 Provisionamento e Deploy da aplicação

### 1. Banco de Dados (infra-database)

  ```
  ⚠️ Não é necessária nenhuma ação.
  ```

   - O banco PostgreSQL **já está provisionado e rodando** em produção (Neon).
   - Secrets `NEON_API_KEY` e `NEON_ORG_ID` já estão configurados no repositório.
   - Para replicar em sua própria conta Neon, consulte [12soat-oficina-infra-database](https://github.com/cassiamartinelli-fc/12soat-oficina-infra-database).

### 2. Infraestrutura AWS (infra-k8s)

  2.1. Provisionar infraestrutura:
  ```
  Execute workflow `Terraform AWS` → apply (aguardar ~3 min)
  ```

  2.2. Obter URL pública e informações da infraestrutura:
  ```
  Execute workflow `Terraform AWS` → output
  ```

  2.3. Validar provisionamento (health check):
  ```bash
  # Substituir <KONG_URL> por URL obtida no passo 2.2
  curl <KONG_URL>/health
  ```

   - Secrets necessários já estão configurados no repositório.
   - Para replicar em sua própria conta AWS, consulte [12soat-oficina-infra-k8s](https://github.com/cassiamartinelli-fc/12soat-oficina-infra-k8s).

### 3. Aplicação Principal (oficina-app)

  ```
  ⚠️ Não é necessária nenhuma ação.
  ```

   - **Deploy automático:** Foi provisionada junto com a infraestrutura AWS (EC2 + Docker) no passo 2.
   - A aplicação cria automaticamente a tabela `clientes` no banco (necessária para Lambda).

### 4. Lambda de Autenticação (lambda-auth)
   
  4.1. Deploy da Lambda:
  ```
  Execute workflow `CD - Deploy Lambda to AWS`
  ```
  4.2. Aguarde finalização do deploy e verifique URL da Lambda no summary do workflow.
  
  4.3. Gerar token JWT com Lambda:
  ```bash
  curl -X POST "https://gazxy4ae3ittomlpjso27mbuni0popxn.lambda-url.us-east-1.on.aws/" \
  -H "Content-Type: application/json" \
  -d '{"cpf":"11144477735"}'
  ```

  - A Lambda valida o CPF na tabela `clientes` e gera um token JWT.
  - Kong Gateway já está configurado para aceitar tokens JWT (configurado no passo 2).
  - Para replicar em sua própria conta AWS, consulte [12soat-oficina-lambda-auth](https://github.com/cassiamartinelli-fc/12soat-oficina-lambda-auth).

## ⚙️ Comandos essenciais

### Obter URL da aplicação

```
Execute workflow "Terraform AWS" → "output"
```

### Testar aplicação (rotas públicas - GET)

```bash
# Health check
curl <KONG_URL>/health

# Listar clientes
curl <KONG_URL>/clientes

# Listar veículos
curl <KONG_URL>/veiculos

# Listar peças
curl <KONG_URL>/pecas

# Listar serviços
curl <KONG_URL>/servicos

# Listar ordens de serviço
curl <KONG_URL>/ordens-servico
```

### Autenticação e rotas protegidas

```bash
# 1. Obter KONG_URL e LAMBDA_URL nos passos 2.2 e 4.2, respectivamente, de Provisionamento e Deploy da aplicação

# 2. Autenticar com CPF (substituir <LAMBDA_URL>)
TOKEN=$(curl -X POST <LAMBDA_URL> \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678900"}' | jq -r '.token')

# 3. Usar token em rotas protegidas (POST, PATCH, DELETE)
curl -X POST <KONG_URL>/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Santos","cpfCnpj":"52998224725","telefone":"11988887777"}'

curl -X POST <KONG_URL>/servicos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nome":"Troca de óleo","preco":150.00,"tempoEstimado":60}'

curl -X DELETE <KONG_URL>/servicos/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Desenvolvimento local

```bash
# 1. Instalar dependências
yarn install

# 2. Configurar variáveis de ambiente
export NEON_DATABASE_URL="postgresql://..."
export NEW_RELIC_LICENSE_KEY="..."
export JWT_SECRET="..."

# 3. Executar aplicação
yarn start:dev

# 4. Acessar Swagger
# http://localhost:3000/api-docs
```

## 🔐 CI/CD — Secrets e permissões

✅ **Todos os secrets já estão devidamente configurados neste repositório.**

**Secrets necessários (Settings → Secrets → Actions):**
- `NEON_DATABASE_URL` — Connection string do Neon PostgreSQL
- `JWT_SECRET` — Secret para validação de tokens JWT
- `NEW_RELIC_LICENSE_KEY` - License key do New Relic APM

## 📊 Arquitetura

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ HTTPS
       ▼
┌──────────────┐
│ Kong Gateway │ (Autenticação JWT)
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ NestJS App      │
│ (Kubernetes)    │
│ Min: 2 pods     │
│ Max: 10 pods    │
└────────┬────────┘
         │
         ▼
  ┌──────────────┐
  │ Neon Postgres│
  └──────────────┘
         │
         ▼
  ┌──────────────┐
  │  New Relic   │ (APM + Custom Metrics)
  └──────────────┘
```

## 🔗 APIs Principais

### **Públicas (GET)**
- `GET /health` - Health check
- `GET /clientes` - Listar clientes
- `GET /veiculos` - Listar veículos
- `GET /pecas` - Listar peças
- `GET /servicos` - Listar serviços
- `GET /ordens-servico` - Listar ordens de serviço

### **Protegidas (POST, PATCH, DELETE via JWT)**
- `POST /clientes` - Criar cliente
- `POST /veiculos` - Criar veículo
- `POST /pecas` - Criar peça
- `POST /servicos` - Criar serviço
- `POST /ordens-servico` - Criar ordem de serviço
- `PATCH /{recurso}/:id` - Atualizar recurso
- `DELETE /{recurso}/:id` - Deletar recurso

**Documentação completa:** `<KONG_URL>/api-docs` (Swagger)

### **Status da Ordem de Serviço**

- `RECEBIDA` - Status inicial da ordem
- `EM_DIAGNOSTICO` - Ordem em análise técnica
- `AGUARDANDO_APROVACAO` - Aguardando aprovação do cliente
- `EM_EXECUCAO` - Serviço sendo executado (inicia contagem de tempo)
- `FINALIZADA` - Serviço concluído (finaliza contagem de tempo)
- `CANCELADA` - Cliente não aprovou OS
- `ENTREGUE` - Veículo entregue ao cliente

## 📈 Observabilidade

### **Dashboard New Relic**

**Healthcheck e Uptime:**
- Application Uptime (%)
- Healthcheck Status
- Disponibilidade por Endpoint

**Performance:**
- Latência média das APIs
- Uso de CPU
- Consumo de Memória

**Métricas de Negócio:**
- OS Criadas (últimas 24h)
- Tempo Médio de Execução por Status

**Erros:**
- Taxa de erro das APIs (%)
- Erros por endpoint

### **Custom Events**
- `OrdemServicoCriada` - Registro de criação de OS
- `OrdemServicoTempoStatus` - Tempo em cada status (minutos)
- `OrdemServicoMudancaStatus` - Transições de status
- `OrdemServicoErro` - Erros no processamento

### SSH e logs (debug)

```bash
# No repositório 12soat-oficina-infra-k8s/terraform

# SSH na instância EC2
ssh -i ~/.ssh/oficina-key ubuntu@$(terraform output -raw public_ip)

# Ver logs da aplicação
ssh -i ~/.ssh/oficina-key ubuntu@$(terraform output -raw public_ip) \
  'docker logs -f $(docker ps -q --filter name=app)'

# Ver logs do Kong
ssh -i ~/.ssh/oficina-key ubuntu@$(terraform output -raw public_ip) \
  'docker logs -f $(docker ps -q --filter name=kong)'
```

## 📝 Licença

MIT — Tech Challenge 12SOAT
