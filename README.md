# Charlottesville Kitchen

A website for Charlottesville Kitchen, a local mutual aid organization. It helps
people find community food resources and volunteer opportunities, and gives
organizers a small admin panel to keep that information up to date.

## Overview

The project is a pnpm monorepo with two apps:

- **frontend** — a Next.js (App Router) site with the public pages, an admin
  panel, and thin API route handlers that proxy requests to the backend.
- **backend** — an Express API backed by SQLite (via Prisma) that owns
  authentication, resources, volunteer opportunities, users, and the contact
  form.

The browser only ever talks to the Next.js app. Requests to `/api/*` are proxied
server-side to the backend, which keeps the backend off the public network and
lets the auth cookie stay `HttpOnly`.

## Tech stack

| Area       | Details                                                         |
| ---------- | --------------------------------------------------------------- |
| Frontend   | Next.js 16, React 19, TypeScript, Tailwind CSS, React Hook Form |
| Backend    | Express, TypeScript, Prisma, SQLite                             |
| Auth       | JWT in an `HttpOnly` cookie, bcrypt password hashing            |
| Email      | Nodemailer (contact form)                                       |
| Tooling    | pnpm workspaces, ESLint 9 (flat config), Prettier               |
| Deployment | Docker (multi-stage), pm2, GitHub Actions → GHCR                |

## Project structure

```
cville-kitchen-website/
├── frontend/                # Next.js app
│   └── src/
│       ├── app/             # App Router pages + /api proxy route handlers
│       ├── components/      # UI components and forms
│       ├── contexts/        # Auth context
│       ├── lib/             # API client and markdown helpers
│       └── resources/       # Static markdown resource content
├── backend/                 # Express API
│   ├── prisma/              # Schema, migrations, seed script
│   └── src/
│       ├── routes/          # auth, resources, volunteers, users, contact
│       └── middleware/      # auth guards, error handling
├── Dockerfile               # Multi-stage production image
├── compose.yaml             # Container run configuration
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 20.9+
- pnpm 9+ (`corepack enable` or `npm install -g pnpm`)
- Docker (only for building/running the production image)

## Getting started

```bash
git clone https://github.com/evanWh1te/cville-kitchen-website.git
cd cville-kitchen-website
pnpm install
```

Create the backend environment file and a local database:

```bash
cp backend/.env.example backend/.env
# edit backend/.env — at minimum set JWT_SECRET

pnpm --filter @das-kitchen/backend exec prisma migrate dev
pnpm --filter @das-kitchen/backend db:seed
```

Run both apps together from the repo root:

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Environment variables

Backend (`backend/.env`):

| Variable                                                            | Purpose                                    |
| ------------------------------------------------------------------- | ------------------------------------------ |
| `JWT_SECRET`                                                        | Signing key for auth tokens (required)     |
| `DATABASE_URL`                                                      | SQLite connection string                   |
| `BACKEND_PORT`                                                      | API port (default 3001)                    |
| `FRONTEND_URL`                                                      | Allowed CORS origin                        |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Contact-form email delivery                |
| `CONTACT_EMAIL`                                                     | Where contact submissions are sent         |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`                          | Optional initial admin created by the seed |

The frontend uses `BACKEND_INTERNAL_URL` (defaults to
`http://127.0.0.1:3001/api`) to reach the backend when proxying, and
`COOKIE_INSECURE=true` to allow cookies over plain HTTP in local/container runs.

## Creating the first admin

Either set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` before running the seed,
or `POST /api/auth/create-admin` with an email and password — that endpoint only
works while no users exist.

## Scripts

Run from the repo root:

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Run backend and frontend together  |
| `pnpm build`      | Build both apps                    |
| `pnpm start`      | Start both apps in production mode |
| `pnpm lint`       | Lint both workspaces               |
| `pnpm type-check` | Type-check both workspaces         |

Add `:frontend` or `:backend` to target a single workspace (e.g.
`pnpm build:backend`). Backend-specific database scripts live in
`backend/package.json` (`db:seed`, `db:reset`).

## API endpoints

| Method | Path                     | Notes                        |
| ------ | ------------------------ | ---------------------------- |
| GET    | `/health`                | Health check                 |
| POST   | `/api/contact`           | Contact form (rate limited)  |
| POST   | `/api/auth/login`        | Log in, sets auth cookie     |
| POST   | `/api/auth/logout`       | Clear auth cookie            |
| GET    | `/api/auth/me`           | Current user                 |
| POST   | `/api/auth/create-admin` | First admin bootstrap        |
| GET    | `/api/resources`         | Public resource listing      |
| —      | `/api/resources/*`       | Admin CRUD (auth required)   |
| GET    | `/api/volunteers`        | Public volunteer listing     |
| —      | `/api/volunteers/*`      | Admin CRUD (auth required)   |
| —      | `/api/users/*`           | User management (admin only) |

The backend applies Helmet, CORS, request logging, and rate limiting (a global
limit plus tighter limits on the contact form and authentication endpoints).

## Content

Public food resources are stored in the database and can be managed through the
admin panel. Some longer-form resource content also lives as markdown in
`frontend/src/resources/` and is rendered on the resources page.

## Deployment

The `Dockerfile` produces a single multi-stage image that runs both apps under
pm2. GitHub Actions builds and pushes the image to GHCR on pushes to `main` and
version tags.

Build and run locally with Compose:

```bash
docker compose up --build
```

The container expects the SQLite database to be mounted at `/app/backend/data/`.
Set `PRISMA_MIGRATE=true` to run `prisma migrate deploy` on startup.

## Contributing

Issues and pull requests are welcome. Before opening a PR, run `pnpm lint` and
`pnpm type-check`.

## License

Licensed under the GNU Affero General Public License v3.0. See
[LICENSE](LICENSE). The AGPL's network clause means anyone running a modified
version as a networked service must make their changes available under the same
terms.
