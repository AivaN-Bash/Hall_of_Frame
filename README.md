# Hall of Fame

Personal full-stack media archive for series, films, anime, games, and music — featuring a scroll-driven 3D helix ribbon hero, interactive frosted-glass collection folders, written *"why I love it"* reviews for every entry, and in-site admin editing.

## Highlights

- **3D Helix Ribbon Hero:** Scroll-choreographed 3D poster ribbon transitioning into a color-matched closing grid, with animated gradient typography and responsive mobile scaling.
- **Glass Folder Collections:** Interactive frosted-glass category folders with procedural marble art and fanned entry previews.
- **Resilient Public Reads:** Falls back cleanly to the built-in archive (`web/src/lib/fallbackData.ts`) if no API URL is configured or during backend cold starts.
- **In-Site Admin:** JWT-authenticated drawers to create/edit/reorder entries and categories, upload poster images (magic-byte validated), and customize hero copy.

## Stack

- **Frontend (`/web`):** Vite, React 19, TypeScript, Tailwind CSS v4, Motion, React Router 7
- **Backend (`/api`):** Spring Boot 3, Java 21, Spring Security (JWT), Spring Data JPA, Flyway, PostgreSQL
- **Database:** PostgreSQL 16 (`docker-compose.yml`)

## Prerequisites

- **Database:** Docker Desktop (or PostgreSQL 16 running on `localhost:5432`)
- **API:** Java 21+ (`JAVA_HOME` set to JDK 21 or 23) and Maven 3.9+
- **Web:** Node.js 20+ and npm 10+

## Environment Setup

Copy the example environment files before running (defaults work out of the box for local `dev`):

```bash
cp .env.example .env
cp api/.env.example api/.env
cp web/.env.example web/.env
```

Default local admin credentials in `api/src/main/resources/application.yml` (override with `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars — synced on startup):
- Username: `admin`
- Password: `change-me-dev-password`

## Run Locally

1. **Database:**
   ```bash
   docker compose up -d
   ```

2. **API** (runs Flyway migrations + `dev` seed data):
   ```bash
   cd api && mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

3. **Web:**
   ```bash
   cd web && npm install && npm run dev
   ```

Open `http://localhost:5173`.

## Run Tests & Build

```bash
cd api && mvn test
cd web && npm run build
```

## Deployment

- **Web (Vercel):**
  - Root directory: `web`
  - Build command: `npm run build`, Output directory: `dist`
  - Set `VITE_API_BASE_URL` to your deployed API origin (e.g. `https://hall-of-fame-api.onrender.com`).
  - `web/vercel.json` handles React Router SPA rewrites.
- **API (Render Blueprint via `render.yaml` or Docker):**
  - Builds from `api/Dockerfile` and provisions PostgreSQL (`hall-of-fame-db`).
  - Env vars: `PGHOST`/`PGPORT`/`PGDATABASE`/`PGUSER`/`PGPASSWORD` (or `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`), `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `CORS_ALLOWED_ORIGIN` (comma-separated origins supported, e.g. `https://web-two-theta-28.vercel.app`).
  - Use `SPRING_PROFILES_ACTIVE=dev` only if you want initial sample seed data populated; omit it in production for a clean database.
