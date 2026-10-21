# Charlottesville Kitchen

A website for Charlottesville Kitchen, a local mutual aid organization. It helps
people find community food resources and volunteer opportunities. Organizers
keep that information up to date by editing a couple of YAML files.

## Overview

The project is a pnpm monorepo with two apps:

- **frontend** — a Next.js (App Router) site built as a fully static export
  (`output: 'export'`). Resources and volunteer opportunities come from YAML
  files in `frontend/content/`, validated and baked into the HTML at build time.
- **backend** — a tiny Express API whose only job is to email contact-form
  submissions.

In production, the static files are served by nginx. The same nginx proxies
`POST /api/contact` to the contact API, so the browser only ever talks to one
origin. There is no database and no server-side state.

## Tech stack

| Area       | Details                                                    |
| ---------- | ---------------------------------------------------------- |
| Frontend   | Next.js 16 (static export), React 19, TypeScript, Tailwind |
| Content    | YAML files validated with zod at build time                |
| Backend    | Express, TypeScript, Nodemailer (contact form only)        |
| Serving    | nginx (unprivileged image) in front of the contact API     |
| Tooling    | pnpm workspaces, ESLint 9 (flat config), Prettier          |
| Deployment | Docker (one multi-stage Dockerfile, two images), Forgejo CI |

## Project structure

```
cville-kitchen-website/
├── frontend/                # Next.js static site
│   ├── content/             # resources.yaml, volunteers.yaml (the site's data)
│   ├── scripts/             # one-time database -> YAML export
│   └── src/
│       ├── app/             # App Router pages
│       ├── components/      # UI components and forms
│       └── lib/             # content loader, helpers
├── backend/                 # Express contact-form API
│   └── src/
│       ├── routes/          # contact
│       └── middleware/      # error handling
├── docker/nginx/            # nginx config template for the web image
├── Dockerfile               # Multi-stage build: `web` and `contact` targets
├── compose.yaml             # Runs both containers
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 20.9+
- pnpm 9+ (`corepack enable` or `npm install -g pnpm`)
- Docker (only for building/running the production images)

## Getting started

```bash
git clone https://github.com/evanWh1te/cville-kitchen-website.git
cd cville-kitchen-website
pnpm install
cp backend/.env.example backend/.env
# edit backend/.env — set the SMTP_* variables and CONTACT_EMAIL
pnpm dev
```

- Frontend: http://localhost:3000
- Contact API: http://localhost:3001

In dev the frontend posts the contact form straight to the backend on port 3001
(see `NEXT_PUBLIC_CONTACT_ENDPOINT` below); the backend's CORS default already
allows `http://localhost:3000`.

## Editing content

The site's resources and volunteer opportunities live in
`frontend/content/`:

- `resources.yaml`
- `volunteers.yaml`

The comment header at the top of each file is the field reference. Edit the
file, commit, and push.

Content is validated whenever the site is built. A bad edit fails
`pnpm build:frontend` (and the CI build) with the entry and field named, so a
typo can't reach the live site. Run it locally to check your change:

```bash
pnpm build:frontend
```

Pushing to `main` makes CI rebuild the site and deploy it.

### Migrating from the old database

Earlier versions kept this content in a SQLite database. To convert one into
the YAML files, run the one-time export:

```bash
node frontend/scripts/export-db-to-yaml.mjs <path-to-database.db> [outDir]
```

## Environment variables

Backend (`backend/.env`):

| Variable                                                            | Purpose                                                        |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| `BACKEND_PORT`                                                      | API port (default 3001)                                        |
| `FRONTEND_URL`                                                      | Allowed CORS origin (default `http://localhost:3000`)          |
| `NODE_ENV`                                                          | `production` in containers                                     |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Contact-form email delivery                                    |
| `CONTACT_EMAIL`                                                     | Where contact submissions are sent                             |
| `TRUST_PROXY`                                                       | Number of proxy hops in front of the API (default 1)           |

`TRUST_PROXY` controls how the API finds the real client IP, which its rate
limiter depends on. With just the nginx web container in front, `1` is right.
Raise it to `2` when another proxy (for example a host reverse proxy) also sits
in front of the web container; `compose.yaml` sets it to `2` for the droplet.

Frontend and web container:

- `SITE_URL` (build arg / build-time env, defaults to `https://cville.kitchen`)
  is the base for canonical tags, Open Graph URLs, `sitemap.xml`, and structured
  data. It is baked into the static pages, so pointing a staging deploy at a
  different domain means setting it when building, not only when running.
- `NEXT_PUBLIC_CONTACT_ENDPOINT` (build-time) is the URL the contact form posts
  to. It defaults to `/api/contact` on the same origin, which is what production
  wants. `pnpm dev` sets it to `http://localhost:3001/api/contact` unless you
  override it.
- `CONTACT_UPSTREAM` (run-time, web container) is where nginx proxies
  `/api/contact`. It defaults to `http://contact:3001`; in Kubernetes, point it
  at the contact Service.

## Scripts

Run from the repo root:

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `pnpm dev`        | Run backend and frontend together        |
| `pnpm build`      | Build both apps (static site in `frontend/out`) |
| `pnpm lint`       | Lint both workspaces                     |
| `pnpm type-check` | Type-check both workspaces               |

Add `:frontend` or `:backend` to target a single workspace (e.g.
`pnpm build:backend`). `pnpm start:backend` runs the compiled contact API. The
frontend has no `start` script: it is a static export, so to preview the
production setup use `docker compose up --build`.

## API endpoints

| Method | Path           | Notes                       |
| ------ | -------------- | --------------------------- |
| GET    | `/health`      | Health check (contact API)  |
| POST   | `/api/contact` | Contact form (rate limited) |

The backend applies Helmet, CORS, request logging, and rate limiting. In the
web container nginx exposes only `POST /api/contact`; every other `/api/*` path
returns 404.

## Docker and deployment

One `Dockerfile` builds two images:

- `web` — the static site served by an unprivileged nginx on port 8080. It
  proxies `/api/contact` to `CONTACT_UPSTREAM`.
- `contact` — the Express contact API on port 3001, running as a non-root user.

Build and run both locally with Compose:

```bash
docker compose up --build
```

The site is then on http://localhost:3000 and the contact API is reachable only
through it. The `contact` service reads its settings from `backend/.env`.

Forgejo CI (`.forgejo/workflows/build-deploy.yml`) type-checks, lints, and
builds on every push and pull request, then builds and pushes both images and
bumps their tags in the deployment repository on pushes to `main`. The GitHub
mirror (`.github/workflows/build.yml`) only runs the checks and the build.

## Contributing

Issues and pull requests are welcome. Before opening a PR, run `pnpm lint`,
`pnpm type-check`, and `pnpm build:frontend`.

## License

Licensed under the GNU Affero General Public License v3.0. See
[LICENSE](LICENSE). The AGPL's network clause means anyone running a modified
version as a networked service must make their changes available under the same
terms.
