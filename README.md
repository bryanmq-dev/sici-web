# SICI Web

Plataforma fullstack para la Sociedad de Investigación, Ciencia e Innovación (SICI) de la
carrera de Ingeniería de Sistemas Informáticos — UNIVALLE: repositorio de proyectos y
artículos de investigación, incubadora de ideas, mentorías, foro, eventos, gamificación
(isipoints, medallas, misiones) y panel de administración con flujo de aprobación de
solicitudes de ingreso a la sociedad.

**En vivo**: https://soceisi.com
**Repo**: https://github.com/bryanmq-dev/sici-web

## Stack

Next.js 15 (App Router + Server Actions) · Drizzle ORM · PostgreSQL · Auth.js v5
(Credentials + JWT) · Zod · Tailwind v4 — fullstack en un solo servicio, sin backend separado.
Archivos (PDFs de artículos, syllabus, imágenes) se sirven desde un volumen propio en el VPS,
no un bucket externo.

## Correr en local

```bash
cd frontend
pnpm install
cp .env.example .env        # ajusta DATABASE_URL, NEXTAUTH_SECRET, SMTP_*
docker compose up -d postgres
pnpm db:push
pnpm db:seed
pnpm dev
```

## Loop de testing (TestSprite)

Este repo participa en el hackathon TestSprite S3. El loop real (escribir → verificar con
`testsprite test create --plan-from ... --run --wait` contra `https://soceisi.com` → arreglar →
verificar de nuevo) está documentado iteración por iteración en [`LOOP.md`](./LOOP.md).
