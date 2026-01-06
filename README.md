# Oficina Mecânica - Aplicação Principal

Aplicação NestJS com Clean Architecture (DDD) para gestão de oficina mecânica.

---

## 🎯 Propósito

API REST para gerenciamento de ordens de serviço, clientes, veículos, peças e serviços de oficina mecânica. Implementa autenticação JWT via Kong API Gateway e observabilidade com New Relic.

---

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js com TypeScript
- **TypeORM** - ORM para PostgreSQL
- **Neon PostgreSQL** - Banco de dados gerenciado
- **Kong Gateway** - API Gateway com autenticação JWT
- **New Relic** - APM e observabilidade
- **Kubernetes** - Orquestração de containers
- **GitHub Actions** - CI/CD automático

---

## 📁 Estrutura DDD

```
src/
├── application/     - DTOs, Use Cases e Mappers
├── domain/          - Entidades e Value Objects
├── infrastructure/  - Repositórios e Persistência
├── presentation/    - Controllers REST
└── shared/          - Services e Exceções
```

---

## 🚀 Deploy

### **Automático (CI/CD)**

1. Push na branch `main`
2. GitHub Actions executa build e deploy
3. Aplicação atualizada em ~5 minutos

### **Local (Desenvolvimento)**

```bash
yarn install
yarn start:dev
# Acesse: http://localhost:3000/api-docs
```

### **Kubernetes**

```bash
# Build e push da imagem
docker build -t ghcr.io/<seu-usuario>/oficina-app:latest .
docker push ghcr.io/<seu-usuario>/oficina-app:latest

# Deploy no cluster
kubectl apply -f k8s/
kubectl rollout status deployment/oficina-app -n default
```

---

## 🔐 Secrets Necessários

Configure no GitHub: **Settings → Secrets → Actions**

| Secret | Descrição |
|--------|-----------|
| `NEON_DATABASE_URL` | Connection string do Neon PostgreSQL |
| `JWT_SECRET` | Secret para validação de tokens JWT |
| `NEW_RELIC_LICENSE_KEY` | License key do New Relic APM |

---

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

---

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

---

## 📈 Observabilidade

### **New Relic APM**
- Performance de endpoints
- Latência de banco de dados
- Taxa de erros

### **Custom Metrics**
- `Custom/OrdemServico/Criada` - Total de OS criadas
- `Custom/OrdemServico/TempoNoStatus/{status}` - Tempo médio por status
- `Custom/OrdemServico/Transicao/{de}_para_{para}` - Transições de status

---

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

---

## 🔗 Recursos

- **Swagger**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **New Relic Dashboard**: https://one.newrelic.com/
- **GitHub Actions**: https://github.com/<usuario>/12soat-oficina-app/actions

---

## 📄 Licença

MIT - Tech Challenge 12SOAT Fase 3
