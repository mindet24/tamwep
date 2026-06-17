# TAMWEP Monorepo

This repository contains a simple monorepo scaffold for the TAMWEP agency project.

Structure:

- `apps/backend` - NestJS backend (API)
- `apps/frontend` - Next.js frontend

Quick start (Windows / PowerShell):

1. Install dependencies at repository root or in each app folder:

```bash
cd apps/backend
npm install
cd ../frontend
npm install
```

2. Run backend:

```bash
cd apps/backend
npm run dev
```

3. Run frontend:

```bash
cd apps/frontend
npm run dev
```

Notes:
- This scaffold includes minimal starter files. Install required packages before running.
- I can initialize Git and push to a remote repo if you want.
 
Database / Prisma
- Start a local Postgres (or use Docker Compose):

```powershell
docker-compose up -d
```

- Set `apps/backend/.env` (or copy `.env.example`) with `DATABASE_URL` before running migrations:

```text
DATABASE_URL=postgresql://postgres:password@localhost:5432/tamwep_db
```

- Generate Prisma client and migrate:

```powershell
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init
```

Auth (NextAuth)
- Configure OAuth credentials and set environment variables in `apps/frontend/.env.local`:

```text
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecret
```

Deployment
- I can help set up Vercel (frontend) and Railway (backend + Postgres) when you are ready.
