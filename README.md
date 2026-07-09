# SICI Web

Plataforma que busca ser el punto único de investigación, incubación de
proyectos, mentorías, comunidad y reconocimiento (gamificación) de la
Sociedad de Investigación, Ciencia e Innovación (SICI) — carrera de
Ingeniería de Sistemas Informáticos, UNIVALLE. No es solo un sitio
informativo: cubre todo el ciclo, desde postular una idea o artículo hasta
verla aprobada, incubada, mentoreada y reconocida con puntos e insignias —
con un modo de exploración 3D del campus como diferencial frente a un
portal universitario típico.

**En vivo**: https://soceisi.com
**Repo**: https://github.com/bryanmq-dev/sici-web

## Qué incluye

- Repositorio de artículos y proyectos de investigación, con flujo de
  postulación → aprobación admin.
- Incubadora de ideas: equipos, solicitudes de ingreso, sugerencias.
- Mentorías (abiertas o por solicitud) y cursos con inscripción.
- Foro, eventos con RSVP, y una comunidad dinámica por áreas (Programación
  Competitiva, AWS, Ciberseguridad, Voluntariado, ISI Sports).
- Gamificación real: isipoints, medallas y misiones disparadas por acciones
  concretas del usuario (no solo registros sueltos).
- Panel de administración completo: usuarios, contenido, incubadora,
  organización, notificaciones.
- Modo 3D interactivo del campus (puertas, luces, colisión, controles
  táctiles) modelado en Blender.
- SICI-Bot, un chatbot con conocimiento del sitio.

## Stack

- **Core (Next.js 15 fullstack)**: App Router + Server Actions, Drizzle ORM
  + PostgreSQL, Auth.js v5 (Credentials + JWT), Zod, Tailwind v4 — sin
  backend separado para el núcleo del sistema. Archivos (PDFs, syllabus,
  imágenes) se sirven desde un volumen propio en el VPS, no un bucket
  externo.
- **Modo 3D**: React Three Fiber + drei + three.js, assets modelados en
  Blender y comprimidos con `gltf-transform` (~83% menos peso, sin romper
  las interacciones nombradas de puertas/luces/escaleras).
- **IA**: SICI-Bot corriendo sobre OpenCode Go, invocado solo del lado del
  servidor (la API key nunca llega al navegador).
- **Comunidad / CMS**: Strapi v5 desplegado aparte (`cms.soceisi.com`) para
  el contenido editorial de `/comunidad`, consumido por el core vía API —
  arquitectura híbrida: Next.js fullstack para el sistema central, Strapi
  para contenido desacoplado del equipo de comunidad.
- **Infraestructura**: Docker (`Dockerfile` multi-stage + `docker-compose`
  con Postgres), desplegado en un VPS gestionado con Coolify, detrás de
  Cloudflare.
- **Flujo de desarrollo**: construido con Claude Code, modelado 3D en
  Blender, validado end-to-end con TestSprite contra producción — loop real
  de escribir → verificar → arreglar → verificar de nuevo, documentado
  iteración por iteración en [`LOOP.md`](./LOOP.md). Control de versiones
  en Git/GitHub.

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

Este repo participa en el hackathon TestSprite S3. El loop real (escribir →
verificar con `testsprite test create --plan-from ... --run --wait` contra
`https://soceisi.com` → arreglar → verificar de nuevo) está documentado
iteración por iteración en [`LOOP.md`](./LOOP.md).
