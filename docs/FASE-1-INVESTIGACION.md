# Fase 1 — Investigación (Projects, Artículos, Eventos)

Construida sobre las primitivas de [[FASE-0-SEGURIDAD-FUNDAMENTOS]]: `requireAuth`/`requireAdmin`/
`requireOwner`, `awardPoints`, `toggleLike`, `lib/upload.ts`.

## Projects

- `projects` gana `status` (pending/approved/rejected, nace pending), `impactScore`
  ("Impacto SOCEISI"), `supportSlots` (cupos de apoyo).
- Nuevas tablas: `project_co_authors` (coautores normalizados) y `project_support_requests`
  (solicitudes de apoyo de otros estudiantes, con estado pending/approved/rejected).
- `getProjects()` público filtra `status='approved'`; `getProjectsForAdmin()` (sin filtro,
  admin-only) para la cola de aprobación del panel.
- `approveProject`/`rejectProject` (admin): al aprobar, `awardPoints` al autor (100 pts) y a
  cada coautor (40 pts), notifica al autor.
- `requestSupport`/`respondToSupportRequest`: el creador aprueba/rechaza solicitudes de apoyo
  desde el detalle del proyecto. **`respondToSupportRequest` corre dentro de
  `db.transaction` con `SELECT ... FOR UPDATE`** sobre la fila del proyecto — sin ese lock,
  dos aprobaciones concurrentes podrían leer el mismo conteo de cupos antes de que ninguna
  confirmara y vender más cupos de los que hay (mismo tipo de race que los likes de Fase 0,
  aquí con impacto de negocio real). Verificado con 8 solicitudes concurrentes contra 3 cupos.
- `promoteCoAuthor`/`demoteCoAuthor` (solo el creador).
- UI nueva: `/projects/new` (formulario de postulación) y `/projects/[id]` reescrita de cero —
  **antes leía de datos mock (`lib/data`) y nunca estaba conectada a la DB**, ahora es
  server component real con like, coautores, cola de solicitudes de apoyo para el dueño/admin.

## Artículos

- `articles` gana `status`, `execSummary` (jsonb: introducción/metodología/resultados/
  conclusión), `publicationDate` (se setea al aprobar).
- `getArticles()` público filtra `approved`; `getArticlesForAdmin()` sin filtro.
- `approveArticle`/`rejectArticle` (admin): `awardPoints` (100 pts) a cada autor en
  `authorIds[]`, notifica.
- `/articles/new` — existía como mockup visual sin conectar (el botón "PUBLICAR" no hacía
  nada); ahora tiene los campos de resumen ejecutivo y llama a `createArticle`.
- `/articles/[id]` reescrita — también leía de mock data; ahora es DB-backed con resumen
  ejecutivo por secciones, autores reales, y descarga de PDF.

## Eventos

- `events` gana `appliesToScore`, `scoreDescription`, `scorePoints` (checkbox "aplica a
  puntaje" del spec).
- Nuevas tablas `event_participants` (intent: collaborate/support, evaluationScore) y
  `event_gallery_images`.
- `getNextUpcomingEvent()`, `requestEventParticipation`, `evaluateEventParticipant`
  (`awardPoints` si `appliesToScore`), `addImpactGalleryImage`.
- `/events/[id]` — no existía ninguna página de detalle (el botón "Detalles" de `EventCard`
  no enlazaba a nada). Nueva: botones "¿Deseas colaborar?"/"Apoyar en actividad", cola de
  evaluación de participantes para admin.
- `/events` — sección "Próximo evento" (countdown real usando `getNextUpcomingEvent()` +
  el componente `Countdown` que ya existía pero no se usaba) y "Archivos de Impacto"
  (nuevo `components/ImpactGallery.tsx`).

## Verificación

`pnpm verify:phase1`: proyectos/artículos pending no aparecen en listados públicos; 8
aprobaciones de apoyo concurrentes contra 3 cupos → exactamente 3 aprobadas, sin overselling.
`npx tsc --noEmit`, `pnpm build` y `pnpm lint` limpios (mismo error preexistente no relacionado
en `hooks/use-mobile.ts`).

## Fuera de alcance de esta fase

La UI para que el dueño gestione cupos/coautores/evaluaciones desde "Mi Perfil" (sidebar
scoped al estudiante) se conecta en Fase 4 — las actions ya existen y son consumibles desde el
detalle del proyecto mientras tanto. La cola de aprobación en `/admin/projects` y
`/admin/articles` (tab "Pendientes") se conecta en Fase 5.
