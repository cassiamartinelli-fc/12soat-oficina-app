# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instalar curl para health checks e dumb-init para signal handling
RUN apk add --no-cache curl dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar build da aplicação do estágio anterior
COPY --from=builder /app/dist ./dist

# Copiar arquivo de configuração do New Relic
COPY --from=builder /app/newrelic.js ./newrelic.js

# Mudar ownership dos arquivos para o usuário nestjs
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expor porta da aplicação
EXPOSE 3000

# Health check para verificar se a aplicação está respondendo
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Usar dumb-init para proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]