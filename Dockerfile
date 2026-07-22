# Multi-stage build for production optimization
FROM node:24-alpine AS base
# Pin pnpm to match the repo's packageManager field
RUN npm install -g pnpm@11.10.0
WORKDIR /app

# Deps stage — install all workspace dependencies from the frozen lockfile
FROM base AS deps
# python3/make/g++ are required to compile better-sqlite3 (the Prisma driver
# adapter's native dependency); Alpine/musl has no prebuilt binary for it.
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY . .

# Generate the Prisma client into the shared store, then build both apps
RUN pnpm --filter @das-kitchen/backend exec prisma generate
RUN pnpm --filter @das-kitchen/backend build
# Treat lint/type warnings as warnings, not build errors
ENV CI=false
RUN pnpm --filter @das-kitchen/frontend build

# Drop devDependencies to slim the runtime image (build artifacts already emitted)
RUN pnpm prune --prod

# Runner stage
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser && \
    npm install -g pm2 && \
    mkdir -p /app/backend/data && \
    chown -R appuser:nodejs /app/backend/data

# --- Frontend: the Next.js standalone output is self-contained (bundles its
# own node_modules), so it does not depend on the shared pnpm store. ---
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/standalone/frontend ./frontend
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/static ./frontend/.next/static

# --- Backend: compiled output plus its production dependencies. Under pnpm the
# backend's deps live as symlinks in backend/node_modules that resolve into the
# shared store at the root node_modules/.pnpm, so both are required. The
# generated Prisma client lives inside that store. ---
COPY --from=builder --chown=appuser:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=appuser:nodejs /app/backend/package.json ./backend/
COPY --from=builder --chown=appuser:nodejs /app/backend/prisma ./backend/prisma
# Prisma 7 reads the Migrate datasource from prisma.config.ts at startup
COPY --from=builder --chown=appuser:nodejs /app/backend/prisma.config.ts ./backend/
COPY --from=builder --chown=appuser:nodejs /app/backend/node_modules ./backend/node_modules
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
    cd /app/backend && pnpm exec prisma migrate deploy
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
