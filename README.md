# Portfolio — Interactive System Map (3-tier Architecture)

A modern portfolio webapp for **Tabish Tariq** (Data Engineer). The interface is diagram-first: a central system map branches into clickable nodes, each routing to a detail page that can hold deeper sub-diagrams. Styled as a dark-mode "trading dashboard" (warm espresso palette, terracotta / sage / gold accents, serif display).

## Architecture

**3-tier stack:**
- **Backend**: Python 3.12 + FastAPI + SQLAlchemy 2.x + Alembic
- **Database**: PostgreSQL (`webapps.test:portfolio` schema)
- **Frontend**: Next.js 16 (App Router) + React + TypeScript

All content (experiences, projects, homelab, skills, etc.) lives in the PostgreSQL database. Pages fetch via `cache: "no-store"` so updates appear on refresh. Admin UI at `/admin` (password-protected via cookie session).

## Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend**: FastAPI + SQLAlchemy 2.x + Alembic migrations
- **Database**: PostgreSQL (all in `portfolio` schema, no other schemas touched)
- **Diagrams**: React Flow + dagre for auto-layout, adaptive zoom by node count, MiniMap, search/filter
- **Icons**: lucide-react; **Fonts**: Inter / Fraunces / JetBrains Mono

## Develop

### Prerequisites
- Node.js 18+, npm
- Python 3.12 (for backend)
- PostgreSQL with a `portfolio` schema in `webapps.test` database (or local dev instance)

### Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env with your Postgres credentials
python -m venv .venv
.venv/Scripts/activate  # Windows: use backslash
pip install -r requirements.txt

# Run Alembic migrations
python -m alembic upgrade head

# Seed the database with initial content (idempotent)
python scripts/seed_data.py

# Start dev server
python -m uvicorn app.main:app --reload --port 8000
# Swagger docs at http://localhost:8000/docs
```

### Frontend setup

```bash
cp .env.local.example .env.local
# (Already points to http://localhost:8000 by default)

npm install
npm run dev      # http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Type-check + ESLint
```

Both dev servers must run together. The frontend will redirect to `/admin/login` if you try to access `/admin` without a session.

## Environment Variables

### Backend (`backend/.env`)
```
POSTGRES_HOST=192.168.10.198
POSTGRES_PORT=5432
POSTGRES_DB=webapps.test
POSTGRES_USER=dev-user
POSTGRES_PASSWORD=<your-password>
POSTGRES_SCHEMA=portfolio

CORS_ORIGINS=http://localhost:3000

JWT_SECRET=<generate-a-long-random-string>
JWT_EXPIRE_MINUTES=720
ADMIN_COOKIE_NAME=portfolio_admin

ADMIN_USERNAME=postgres
ADMIN_PASSWORD=<your-password>
```

### Frontend (`.env.local`)
```
BACKEND_API_URL=http://localhost:8000
```

For production (Docker Compose on Proxmox LXC), only change `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `CORS_ORIGINS`; all other config stays the same.

## Content Management

### Via Admin UI (Recommended)
1. Visit `http://localhost:3000/admin/login`
2. Sign in with credentials from `backend/.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`)
3. Add/edit/delete:
   - Experiences, Projects, Deliverables
   - Homelab (devices, containers, services, network entities)
   - Skills, Skill groups
   - Academic items (degrees, publications, certifications)
   - Profile (name, title, bio, socials, etc.)
   - Diagrams (node/edge JSON for system maps)

Changes appear on the public pages after a refresh (no cache).

### Via Direct Database Edits
Connect to `webapps.test:portfolio` and edit tables:
- `profile`, `experiences`, `projects`, `project_case_studies`, `project_deliverables`
- `homelab_devices`, `homelab_containers`, `homelab_services`, `homelab_network_entities`
- `skill_groups`, `skills`, `academic_items`, `diagrams`

**Proxmox diagram note**: Container nodes are derived server-side from `homelab_containers` rows. Add a container to the DB and it auto-appears on the graph.

## Project Structure

```
backend/
├─ app/
│  ├─ main.py                # FastAPI app + CORS + router wiring
│  ├─ core/                  # config.py, security.py
│  ├─ db/                    # SQLAlchemy engine, session, Base
│  ├─ models/                # 9 domain models (profile, experience, project, etc.)
│  ├─ schemas/               # Pydantic Read/Create/Update schemas (camelCase)
│  ├─ crud/                  # Generic CRUDBase + per-domain CRUD instances
│  ├─ routers/               # 8 domain routers + auth router
│  └─ deps.py                # get_current_admin, shared dependencies
├─ alembic/                  # Migrations (env.py targets portfolio schema)
├─ scripts/seed_data.py      # One-time seed from old src/data/*.ts
├─ requirements.txt, Dockerfile, .env.example

src/ (frontend)
├─ app/                      # Pages (all async, export const dynamic = "force-dynamic")
│  ├─ page.tsx               # Home (hub diagram + profile)
│  ├─ about, contact, academics, skills, experience, homelab, projects
│  └─ admin/                 # Login, dashboard, CRUD pages (auth-gated)
├─ components/
│  ├─ diagram/               # SystemMap (React Flow), nodes, DiagramPanel, DiagramState
│  ├─ layout/                # AppShell, Sidebar, Footer (accept profile prop)
│  └─ ui/                    # Card, StatCard, Icon, PageHeader, etc.
├─ lib/
│  ├─ api.ts                 # Server-only typed fetch client
│  ├─ admin.ts               # Admin auth helpers (backendLogin, adminFetch)
│  └─ types.ts               # API contract types (Profile, Experience, etc.)
└─ app/globals.css           # Theme tokens + React Flow styling

docker-compose.yml           # Compose for production (Proxmox LXC deployment)
.dockerignore, Dockerfile
```

## Deployment (Docker Compose)

```bash
# On your Proxmox LXC or standalone server:
docker-compose up -d

# First time: run migrations
docker exec <backend-container> python -m alembic upgrade head
docker exec <backend-container> python scripts/seed_data.py

# Backend API: http://<your-host>:8000
# Frontend: http://<your-host>:3000
# Admin UI: http://<your-host>:3000/admin
```

Update `backend/.env` (mounted via `env_file` in compose) with your production Postgres host/credentials before starting.

## Design Notes

- **Cache strategy**: All pages use `cache: "no-store"` + `export const dynamic = "force-dynamic"`. DB changes appear on page refresh with no stale content.
- **Admin auth**: httpOnly session cookies (simpler + safer than client JWT for single-admin portfolio). Set by Server Action, forwarded on every admin API request.
- **Diagram derivation**: Proxmox container nodes are computed server-side from `homelab_containers` rows at request time, so new containers auto-appear without diagram edits.
- **Schema safety**: All Alembic migrations and SQLAlchemy models target only the `portfolio` schema; other schemas in `webapps.test` are never touched.
- **Graph view**: Adaptive zoom by node count, MiniMap on large diagrams (>10 nodes), hover-dim focus (non-connected nodes fade), search/filter with highlighting, fullscreen toggle.

## Links

- Swagger API docs: `http://localhost:8000/docs` (backend)
- Admin UI: `http://localhost:3000/admin` (frontend, requires login)
- Live site: (production URL will be your Proxmox host)
