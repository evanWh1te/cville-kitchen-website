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
# Copy Prisma schema for client generation
COPY backend/prisma ./prisma
# Generate Prisma client
RUN npx prisma generate
RUN npm run build

# Build frontend
WORKDIR /app/frontend
# Set environment variables to treat warnings as warnings, not errors
ENV CI=false
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser && \
    npm install -g pm2 && \
    mkdir -p /app/backend/data && \
    chown -R appuser:nodejs /app/backend/data

# Copy standalone Next.js - it contains a 'frontend' folder, so we extract it
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/standalone/frontend ./frontend
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/static ./frontend/.next/static

# Copy backend
COPY --from=builder --chown=appuser:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=appuser:nodejs /app/backend/package.json ./backend/
# Copy Prisma schema and generated client
COPY --from=builder --chown=appuser:nodejs /app/backend/prisma ./backend/prisma

# Copy root node_modules
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules

# Create startup script for database setup
COPY --chown=appuser:nodejs <<'EOF' /app/start.sh
#!/bin/sh
set -e

echo "Starting application..."

# Check if database file exists
if [ ! -f "/app/backend/data/database.db" ]; then
  echo "Database file not found. This is expected if you're mounting an external database."
  echo "For production, ensure your database.db file is mounted to /app/backend/data/"
  echo "Skipping migrations - no database file found"
else
  echo "Database file found at /app/backend/data/database.db"
  
  # Only run migrations if PRISMA_MIGRATE environment variable is set to true
  if [ "$PRISMA_MIGRATE" = "true" ]; then
    echo "PRISMA_MIGRATE=true detected. Running database migrations..."
    cd /app/backend && npx prisma migrate deploy
  else
    echo "Skipping migrations. Set PRISMA_MIGRATE=true to run migrations."
  fi
fi

# Start PM2
echo "Starting PM2..."
exec pm2-runtime start /app/ecosystem.config.js
EOF

RUN chmod +x /app/start.sh

# PM2 ecosystem config
COPY --chown=appuser:nodejs <<'EOF' /app/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'backend',
      script: '/app/backend/dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'production',
        BACKEND_PORT: '3001',
        DATABASE_URL: 'file:/app/backend/data/database.db'
      }
    },
    {
      name: 'frontend',
      script: '/app/frontend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: '3000'
      }
    }
  ]
};
EOF

USER appuser
EXPOSE 3000 3001

CMD ["/app/start.sh"]