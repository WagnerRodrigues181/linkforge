# LinkForge

![CI](https://github.com/WagnerRodrigues181/linkforge/actions/workflows/ci.yml/badge.svg)

URL shortener with Redis caching and a real-time analytics dashboard.

## Stack
- Backend: Express + TypeScript + Prisma + PostgreSQL + Redis
- Frontend: React + Vite + TypeScript + Tailwind + Recharts
- Infra: Docker Compose + GitHub Actions

## Running locally
Prerequisite: Docker and Docker Compose installed.

```bash
docker compose up --build
```

This brings up 4 services:

| Service | Port | URL |
|---|---|---|
| Client (Vite) | 5173 | http://localhost:5173 |
| Server (Express) | 3000 | http://localhost:3000 |
| Postgres | 5432 | — |
| Redis | 6379 | — |

Backend health check: `curl http://localhost:3000/health`

Hot reload is enabled for both client and server via bind mounts — code changes are reflected without a rebuild.

## Status
In development