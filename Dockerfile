# Multi-stage build for production optimization
FROM node:24-alpine AS base

# Deps stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY frontend ./frontend
COPY backend ./backend

# Build backend
WORKDIR /app/backend
RUN npm run build

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser && \
    npm install -g pm2

# Copy standalone Next.js - it contains a 'frontend' folder, so we extract it
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/standalone/frontend ./frontend
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/static ./frontend/.next/static

# Copy backend
COPY --from=builder --chown=appuser:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=appuser:nodejs /app/backend/package.json ./backend/

# Copy root node_modules
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules

# PM2 ecosystem config
COPY --chown=appuser:nodejs <<'EOF' /app/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './backend/dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: 'frontend',
      script: './frontend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF

USER appuser
EXPOSE 3000

CMD ["pm2-runtime", "start", "/app/ecosystem.config.js"]