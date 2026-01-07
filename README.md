# Oficina Mecânica - Aplicação Principal

Aplicação NestJS com Clean Architecture (DDD) para gestão de oficina mecânica.

## 📦 Repositórios do Projeto

Este projeto está dividido em 4 repositórios:

1. **[12soat-oficina-app](https://github.com/cassiamartinelli-fc/12soat-oficina-app)** ← Você está aqui
   - Aplicação NestJS (API REST)

2. **[12soat-oficina-lambda-auth](https://github.com/cassiamartinelli-fc/12soat-oficina-lambda-auth)**
   - Lambda serverless para autenticação JWT

3. **[12soat-oficina-infra-k8s](https://github.com/cassiamartinelli-fc/12soat-oficina-infra-k8s)**
   - Infraestrutura Kubernetes (Kong Gateway + New Relic)

4. **[12soat-oficina-infra-database](https://github.com/cassiamartinelli-fc/12soat-oficina-infra-database)**
   - Banco de dados Neon PostgreSQL

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


## 📋 **Pré-requisitos**

### *Docker Desktop* instalado e rodando

- Download: https://www.docker.com/products/docker-desktop
- Após instalar, habilite Kubernetes em: Settings → Kubernetes → Enable Kubernetes

### *kubectl* instalado

```bash
# macOS
brew install kubectl

# Verificar instalação
kubectl version --client
```

### *Cluster Kubernetes* ativo

- Ativar Kubernetes

  Via Docker Desktop:
    ```bash
      # 1. Abra Docker Desktop → Vá em Settings (ícone de engrenagem) →
      # 2. Vá em Kubernetes (menu lateral)
      # 3. Marque "Enable Kubernetes"
      # 4. Clique em "Apply & Restart"
      # 5. Aguarde o ícone do Kubernetes ficar verde
      kubectl cluster-info
      kubectl get nodes
      # Deve mostrar: docker-desktop   Ready
    ```

  Via kind:
    ```bash
      # 1. Instalar kind
      brew install kind
      # 2. Criar cluster
      kind create cluster --name oficina
      # 3. Verificar
      kubectl get nodes
      # Deve mostrar: oficina-control-plane   Ready
    ```

### *Banco de dados Neon PostgreSQL* criado e configurado

- Siga: [12soat-oficina-infra-database](https://github.com/cassiamartinelli-fc/12soat-oficina-infra-database)
- Tenha em mãos a connection string do banco

## 🚀 Deploy da Aplicação Completa

### **1. Configurar Secrets do Kubernetes**

Crie os secrets necessários:

```bash
# Secret do banco Neon PostgreSQL
# Substitua "postgresql://user:pass@host/db" pela sua connection string
kubectl create secret generic app-secrets \
  --from-literal=NEON_DATABASE_URL="postgresql://user:pass@host/db" \
  -n default

# Secret do New Relic
# Substitua "seu-license-key" pela sua license key
kubectl create secret generic app-secrets \
  --from-literal=NEW_RELIC_LICENSE_KEY="seu-license-key" \
  -n default --dry-run=client -o yaml | kubectl apply -f -
```

### **2. Deploy da Aplicação**

```bash
# Aplicar manifestos Kubernetes
kubectl apply -f k8s/

# Aguardar pods ficarem prontos (pode levar 2-3 minutos)
kubectl wait --for=condition=ready pod -l app=oficina-app -n default --timeout=300s

# Verificar status
kubectl get pods -n default
```

### **3. Acessar a Aplicação**

```bash
# Port forward para acessar localmente
kubectl port-forward svc/oficina-app-service 3000:80 -n default

# Acesse no navegador:
# - API: http://localhost:3000
# - Swagger: http://localhost:3000/api-docs
# - Health: http://localhost:3000/health
```

### **4. Testar API**

```bash
# Health check
curl http://localhost:3000/health

# Criar cliente (necessário para autenticação posterior)
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpfCnpj": "12345678900",
    "telefone": "11999999999"
  }'

# Criar veículo (use o clienteId retornado acima)
curl -X POST http://localhost:3000/veiculos \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": "<uuid-do-cliente>",
    "placa": "ABC1234",
    "modelo": "Civic",
    "marca": "Honda",
    "ano": 2020
  }'

# Criar ordem de serviço (use clienteId e veiculoId)
curl -X POST http://localhost:3000/ordens-servico \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": "<uuid-cliente>",
    "veiculoId": "<uuid-veiculo>",
    "servicos": [],
    "pecas": []
  }'
```

### **5. Verificar Métricas no New Relic**

1. Acesse: https://one.newrelic.com/
2. Vá em **Query your data** (NRQL)
3. Execute:
   ```sql
   FROM Metric SELECT count(*)
   WHERE metricName = 'Custom/OrdemServico/Criada'
   SINCE 1 hour ago
   ```

## 🔐 Setup de Autenticação (Opcional)

Para habilitar autenticação JWT via Kong Gateway, execute **após** ter a aplicação rodando:

### **1. Deploy da Lambda de Autenticação**

Siga: [12soat-oficina-lambda-auth](https://github.com/cassiamartinelli-fc/12soat-oficina-lambda-auth)
- Deploy da Lambda Function
- Copiar URL da Lambda Function

### **2. Configurar Kong Gateway**

Siga: [12soat-oficina-infra-k8s](https://github.com/cassiamartinelli-fc/12soat-oficina-infra-k8s)
- Instalar Kong Gateway no cluster
- Configurar plugin JWT apontando para a Lambda

### **3. Testar Autenticação**

```bash
# 1. Obter token JWT (use CPF do cliente cadastrado no passo 4)
TOKEN=$(curl -X POST https://<lambda-url> \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678900"}' | jq -r '.token')

# 2. Criar OS via Kong Gateway
curl -X POST http://<kong-url>/ordens-servico \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": "<uuid>",
    "veiculoId": "<uuid>",
    "servicos": [],
    "pecas": []
  }'
```

## 🛠️ Deploy Alternativo

### **Desenvolvimento Local (sem Kubernetes)**

```bash
# Instalar dependências
yarn install

# Configurar variáveis de ambiente
export NEON_DATABASE_URL="postgresql://..."
export NEW_RELIC_LICENSE_KEY="..."

# Rodar em modo dev
yarn start:dev

# Acesse: http://localhost:3000/api-docs
```

### **CI/CD Automático (GitHub Actions)**

1. Configure secrets no GitHub (Settings → Secrets)
2. Push na branch `main`
3. GitHub Actions faz build e deploy automático
4. Aplicação atualizada em ~5 minutos

## 🔐 Secrets Necessários

Configure no GitHub: **Settings → Secrets → Actions**

| Secret | Descrição |
|--------|-----------|
| `NEON_DATABASE_URL` | Connection string do Neon PostgreSQL |
| `JWT_SECRET` | Secret para validação de tokens JWT |
| `NEW_RELIC_LICENSE_KEY` | License key do New Relic APM |

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

### **Públicas**
- `GET /health` - Health check
- `GET /` - API info

### **Protegidas (requerem JWT via Kong)**
- `POST /ordens-servico` - Criar ordem de serviço
- `GET /ordens-servico/:id` - Consultar ordem
- `POST /ordens-servico/:id/aprovacao` - Aprovar orçamento
- `POST /ordens-servico/:id/status` - Atualizar status
- `GET /ordens-servico/em-andamento` - Listar OS em andamento

**Documentação completa:** http://localhost:3000/api-docs (Swagger)

## 📈 Observabilidade

### **New Relic APM**
- Performance de endpoints
- Latência de banco de dados
- Taxa de erros

### **Custom Metrics**
- `Custom/OrdemServico/Criada` - Total de OS criadas
- `Custom/OrdemServico/TempoNoStatus/{status}` - Tempo médio por status
- `Custom/OrdemServico/Transicao/{de}_para_{para}` - Transições de status

## 🧪 Como Testar

### **Health Check**
```bash
kubectl port-forward svc/oficina-app-service 3000:80 -n default
curl http://localhost:3000/health
```

### **Criar Ordem de Serviço (via Kong)**
```bash
# 1. Obter token JWT da Lambda de autenticação
TOKEN=$(curl -X POST https://<lambda-url> \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678900"}' | jq -r '.token')

# 2. Criar OS via Kong Gateway
curl -X POST http://<kong-url>/ordens-servico \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": "<uuid>",
    "veiculoId": "<uuid>",
    "servicos": [],
    "pecas": []
  }'
```

## 🔗 Recursos

- **Swagger**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **New Relic Dashboard**: https://one.newrelic.com/
- **GitHub Actions**: https://github.com/cassiamartinelli-fc/12soat-oficina-app/actions

## 📄 Licença

MIT - Tech Challenge 12SOAT Fase 3
