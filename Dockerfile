# Multi-stage build with two final targets:
#   web     static site served by nginx (port 8080), proxies /api/contact
#   contact the Express contact-form API (port 3001)
#
#   docker build --target web -t cville-kitchen-web .
#   docker build --target contact -t cville-kitchen-contact .

# Pin pnpm to match the repo's packageManager field
FROM node:24.11.1-alpine3.22 AS base
RUN npm install -g pnpm@11.10.0
WORKDIR /app

# --- web: build the static site ---
FROM base AS web-build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
# Install only the frontend workspace; the backend's deps are not needed here
RUN pnpm install --frozen-lockfile --filter @cville-kitchen/frontend...
COPY frontend ./frontend
# Statically prerendered pages bake canonical/Open Graph URLs and sitemap.xml
# in at build time, so the site's base URL has to be present for the build.
ARG SITE_URL=https://cville.kitchen
ENV SITE_URL=$SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_CONTACT_ENDPOINT is deliberately left unset: the contact form
# then posts to the same origin (/api/contact), which nginx proxies.
# The build also validates frontend/content/*.yaml and fails on a bad entry.
RUN pnpm --filter @cville-kitchen/frontend build

# --- contact: compile the backend and prune it to production deps ---
FROM base AS contact-build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --filter @cville-kitchen/backend...
COPY backend ./backend
RUN pnpm --filter @cville-kitchen/backend build
# `pnpm deploy` copies the package plus its production dependencies into a
# standalone directory. pnpm 10+ refuses it unless workspace packages are
# injected; the backend has no workspace dependencies, so --legacy (the old
# behaviour) is the simplest way to opt out of that requirement.
RUN pnpm --filter @cville-kitchen/backend deploy --legacy --prod /deploy \
    && cp -r backend/dist /deploy/dist

# --- Final target: contact ---
FROM node:24.11.1-alpine3.22 AS contact
ENV NODE_ENV=production
WORKDIR /app
COPY --from=contact-build --chown=node:node /deploy ./
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:${BACKEND_PORT:-3001}/health || exit 1
CMD ["node", "dist/index.js"]

# --- Final target: web (the default when no --target is given is the last stage) ---
# The unprivileged image runs as the nginx user on 8080, so it needs no root
# and no extra capabilities in Kubernetes.
FROM nginxinc/nginx-unprivileged:1.28.0-alpine AS web
# Where /api/contact is proxied; override for Kubernetes (the contact Service).
ENV CONTACT_UPSTREAM=http://contact:3001
# Only substitute CONTACT_UPSTREAM so nginx's own $uri etc. survive envsubst
ENV NGINX_ENVSUBST_FILTER=^CONTACT_UPSTREAM$
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=web-build /app/frontend/out /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1
