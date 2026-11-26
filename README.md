# Hall of Fame

Personal full-stack media archive for series, films, anime, games, and music.

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

## Run Locally (3 commands)

1. **Start PostgreSQL:**
   ```bash
   docker compose up -d
   ```

2. **Start the Spring Boot API** (runs Flyway migrations + `dev` sample seed data including DARK):
   ```bash
   cd api && mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

3. **Start the Vite React frontend:**
   ```bash
   cd web && npm install && npm run dev
   ```

Open `http://localhost:5173`.

## Run Tests

```bash
cd api && mvn test
cd web && npm run build
```
