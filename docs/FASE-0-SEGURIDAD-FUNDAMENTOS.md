# Fase 0 — Seguridad y fundamentos

Base bloqueante sobre la que se construyen las Fases 1-5. Sin features nuevas: cierra huecos
de seguridad reales en la capa de server actions y deja primitivas reutilizables.

## Vulnerabilidades cerradas

Auditoría previa a esta fase encontró escalación de privilegios real en producción potencial:
cualquier usuario autenticado podía reescribir el puntaje de otro usuario (`updateUserScore`),
el progreso de misiones ajenas (`updateQuestProgress`/`acceptQuest` recibían `userId` como
parámetro en vez de derivarlo de la sesión), crear notificaciones a nombre de cualquier usuario
(`createNotification` sin auth check), y aprobar/rechazar postulaciones sin ser admin
(`updateJoinApplicationStatus`). Cero validación de input (sin Zod) en las 11 server actions.

Todo corregido: `updateUserScore` eliminada, `updateQuestProgress`/`acceptQuest` derivan el
usuario de la sesión, `createNotification` gateada con `requireAdmin()`, `createMentor` ya no
acepta `userId` arbitrario, `updateJoinApplicationStatus` exige admin y toma `reviewedBy` de la
sesión (antes recibía un string `'admin'` hardcodeado desde la UI — ni siquiera era un user id
real). `updateProject`/`updateArticle`/`updateIncubatorProject`/`updateMentor` y sus `delete`
verifican dueño o admin antes de mutar.

## Primitivas nuevas

- **`lib/auth-helpers.ts`**: `requireAuth()`, `requireAdmin()`, `requireOwner(ownerId)`. Toda
  action empieza con una de estas tres antes de tocar la DB.
- **`lib/errors.ts`**: `AuthError`, `ForbiddenError`, `NotFoundError`, `ValidationError`.
- **`types/next-auth.d.ts`**: augmentación de `session.user.id/role` — elimina los `as any`
  dispersos en `lib/auth.ts`, `lib/auth.config.ts`, `app/admin/layout.tsx`.
- **`lib/validations/*.ts`**: un schema Zod por dominio (projects, articles, events, incubator,
  mentors, mentorship, forum, courses, organization, notifications, gamification). Convención:
  primera línea de cada action es el guard de auth, segunda es `schema.parse(data)`.
- **`lib/actions/likes.ts`** — `toggleLike(targetType, targetId)`: nueva tabla `content_likes`
  (un like por usuario+recurso, índice único) + incremento atómico (`db.transaction` +
  `sql\`col + 1\``). Reemplaza `likeProject`/`likeArticle`/`likeForumQuestion`, que leían y
  escribían el contador sin transacción (race condition confirmada bajo concurrencia).
  `incrementQuestionViews` corregido al mismo patrón atómico.
- **`awardPoints()`** (`lib/actions/gamification.ts`) — única forma sancionada de tocar puntos
  desde ahora: inserta en la nueva tabla `points_ledger` (auditoría: quién, cuánto, por qué) y
  suma a `users.isiPoints` en la misma transacción atómica.
- **`lib/upload.ts` + `app/api/uploads/[...path]/route.ts`** — subida de archivos al VPS propio
  (fuera de `public/`, porque con `output: 'standalone'` los archivos escritos en runtime dentro
  de `public/` no sobreviven un rebuild). Valida MIME real y tamaño, genera nombre aleatorio
  (cierra path traversal/overwrite), sirve con cache largo para imágenes y
  `Content-Disposition: attachment` para PDFs.

## Cambios de esquema

- `users.isiPoints` (integer, default 0) — puntaje unificado, backfill = `devScore + researchScore`.
  Las columnas viejas se retiran en Fase 4 una vez todos los call sites migren.
- `content_likes` (userId, targetType, targetId, único compuesto).
- `points_ledger` (userId, amount, reason, sourceType, sourceId, awardedBy, createdAt).

## Infraestructura

`docker-compose.yml` — antes solo definía `postgres`. Se agregó el servicio `app` (usa el
`Dockerfile` existente) con volumen nombrado `uploads_data:/app/uploads` y `DATABASE_URL`
sobrescrito al hostname interno de la red de compose (el `.env` de desarrollo apunta a
`localhost:5433`, que no resuelve dentro del contenedor).

## Verificación

`pnpm verify:phase0` (`frontend/scripts/verify-phase0.ts`) — ejercita el mecanismo de
incremento atómico contra Postgres real: 30 likes concurrentes de 30 usuarios de prueba →
conteo final exacto sin lost updates; 30 `awardPoints` concurrentes → `isiPoints` exacto y 30
filas en `points_ledger`. Limpia los datos de prueba al terminar.

`npx tsc --noEmit` y `pnpm build` limpios. `pnpm lint` sin errores nuevos (1 error preexistente
en `hooks/use-mobile.ts`, no relacionado, fuera de alcance de esta fase).

## Archivos tocados

Nuevos: `lib/auth-helpers.ts`, `lib/errors.ts`, `lib/notify.ts`, `lib/upload.ts`,
`lib/validations/*.ts` (11 archivos), `lib/actions/likes.ts`, `types/next-auth.d.ts`,
`app/api/uploads/[...path]/route.ts`, `scripts/verify-phase0.ts`.

Modificados: los 11 archivos de `lib/actions/`, `lib/auth.ts`, `lib/auth.config.ts`,
`app/admin/layout.tsx`, `app/admin/applications/page.tsx`, `app/dashboard/DashboardClient.tsx`,
`db/schema.ts`, `docker-compose.yml`, `package.json` (+`zod`, script `verify:phase0`).
