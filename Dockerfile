# Multi-stage build for production optimization
FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy ALL package files (root and workspaces)
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage (all in root for monorepo)
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Copy source code
COPY frontend ./frontend
COPY backend ./backend

# Ensure public directory exists
RUN mkdir -p /app/frontend/public

# Build applications
WORKDIR /app/backend
RUN npm run build

WORKDIR /app/frontend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Install pm2 globally
RUN npm install -g pm2

# Copy node_modules (only production dependencies if possible)
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules

# Copy built applications
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/static ./.next/static
COPY --from=builder --chown=appuser:nodejs /app/frontend/public ./public
COPY --from=builder --chown=appuser:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=appuser:nodejs /app/backend/package.json ./backend/package.json

RUN ls -R ./.next/static

# Copy startup script using pm2
COPY --chown=appuser:nodejs <<EOF /app/start.sh
#!/bin/sh
# Start backend and frontend using pm2
pm2 start /app/backend/dist/index.js --name backend
pm2 start /app/frontend/server.js --name frontend

# Keep pm2 running in the foreground
pm2-runtime start all
EOF

RUN chmod +x /app/start.sh

USER appuser

EXPOSE 3000

CMD ["/app/start.sh"]