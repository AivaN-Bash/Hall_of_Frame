# Hall of Fame

Personal full-stack media archive for series, films, anime, games, and music — with a written *"why I love it"* for every entry and in-site admin editing.

## Stack

- **Frontend (`/web`):** Vite, React, TypeScript, Tailwind CSS v4, Motion, React Router
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

Default local admin credentials in `api/src/main/resources/application.yml` (override with `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars):
- Username: `admin`
- Password: `change-me-dev-password`

## Run Locally (1 command each)

1. **Database:**
   ```bash
   docker compose up -d
   ```

2. **API** (runs Flyway migrations + `dev` sample seed data with DARK first):
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

## Deployment Notes

- **Web (Vercel or S3 + CloudFront):**
  - Root directory: `web`
  - Build command: `npm run build`, Output directory: `dist`
  - Set `VITE_API_BASE_URL` to your deployed API origin (e.g. `https://api.example.com`).
  - `web/vercel.json` is included for React Router SPA rewrites.
- **API (EC2 / App Runner / Docker + RDS PostgreSQL):**
  - Build using `api/Dockerfile`.
  - Set `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `CORS_ALLOWED_ORIGINS` (your Vercel/CloudFront URL).
  - Run with default/prod profile (do **not** enable `dev` profile in production so sample seed data is not loaded).
