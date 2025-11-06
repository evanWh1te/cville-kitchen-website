# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./frontend/
COPY backend/package.json backend/package-lock.json* ./backend/

# Install dependencies
RUN cd frontend && npm ci --only=production && npm cache clean --force
RUN cd backend && npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copy source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build applications
RUN cd backend && npm run build
RUN cd frontend && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy built applications
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=appuser:nodejs /app/frontend/.next/static ./.next/static
COPY --from=builder --chown=appuser:nodejs /app/frontend/public ./public
COPY --from=builder --chown=appuser:nodejs /app/backend/dist ./backend/
COPY --from=builder --chown=appuser:nodejs /app/backend/package.json ./backend/
COPY --from=builder --chown=appuser:nodejs /app/backend/node_modules ./backend/node_modules

# Copy startup script
COPY --chown=appuser:nodejs <<EOF /app/start.sh
#!/bin/sh
cd /app/backend && node index.js &
cd /app && node server.js &
wait
EOF

RUN chmod +x /app/start.sh

USER appuser

EXPOSE 3000

CMD ["/app/start.sh"]