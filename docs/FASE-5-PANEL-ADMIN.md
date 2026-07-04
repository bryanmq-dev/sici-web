# Fase 5 — Panel admin completo

Última fase: conecta en UI todas las primitivas construidas y ya probadas en Fases 0-4. No
introduce lógica de negocio nueva no verificada — por eso no tiene un script `verify:phase5`
propio (ver sección Verificación).

## Usuarios

- `lib/actions/users.ts` (nuevo): `updateUser`/`setUserRole`/`deleteUser` (`requireAdmin`).
- `/admin/users` — antes solo lectura; ahora tiene toggle admin/student y eliminar por fila.

## Colas de aprobación

Cada tipo de contenido con workflow de aprobación (Fases 1-2) gana una sección "Pendientes"
en su admin page, arriba de la tabla general, con botones Aprobar/Rechazar:

- `/admin/projects` — usa `getProjectsForAdmin`/`approveProject`/`rejectProject` (Fase 1).
- `/admin/articles` — usa `getArticlesForAdmin`/`approveArticle`/`rejectArticle` (Fase 1).
- `/admin/incubator` — antes stub "Próximamente"; ahora cola de aprobación +
  sugerencias de proyectos (`getSuggestionsForAdmin`) + tabla completa + eliminar (Fase 2).
- `/admin/mentorship` — cola de aprobación (`approvalStatus`) sumada a la tabla de estado de
  ciclo de vida que ya existía (aceptar/eliminar).

## Cursos

`/admin/courses` — antes stub; ahora formulario de creación (nombre, categoría, duración,
instructor vía dropdown de `getMentors()`) + tabla + eliminar. La edición de syllabus
estructurado (secciones/lecciones en jsonb) queda fuera de esta fase — se puede seguir
gestionando vía Drizzle Studio mientras tanto; no se justificaba construir un editor jsonb
completo solo para esto (YAGNI).

## Gamificación

`/admin/gamification` — antes stub; ahora:
- Formulario de **otorgar puntos manual** (`awardPoints` directo, para evaluaciones ad-hoc que
  no pasan por un flujo automático).
- CRUD de **insignias** (`createBadge`/`deleteBadge`, nuevos en `gamification.ts`).
- CRUD de **misiones** (`createQuest`/`deleteQuest`, nuevos) — incluye los campos
  `triggerType`/`triggerThreshold` de Fase 4, así el admin puede crear nuevas misiones
  auto-progresables sin tocar código.
- **Visor del ledger de puntos** (`getPointsLedger`, nuevo) — últimas 100 filas de
  `points_ledger` con usuario/monto/motivo/fecha, la auditoría que Fase 0 dejó preparada y
  que hasta ahora no tenía ninguna superficie visible.

## Organización

`/admin/organization` — antes stub; ahora:
- Formulario de **asignar cargo directivo** (`assignDirectiveRole` de Fase 3) — dropdown de
  usuario, dropdown de `DIRECTIVE_ROLES`, selector de género para el título dinámico.
- Lista de la **directiva actual** con botón "Remover cargo" (`removeDirectiveRole`).
- CRUD de **unidades de la sociedad** (ya existía en actions, sin UI hasta ahora).

## Eventos

`/admin/events` — se agregó:
- Formulario de creación con los campos de Fase 1 (`appliesToScore`, `scoreDescription`,
  `scorePoints`) — antes no había ninguna forma de crear eventos desde la UI, solo `delete`.
- Formulario de subida de foto a "Archivos de Impacto" (`addImpactGalleryImage` +
  `uploadImage` de Fase 2).
- Link "Evaluar participantes" por evento → reutiliza `/events/[id]` (ya construido en Fase 1
  con la cola de evaluación para admin) en vez de duplicar esa UI en el panel admin.

## Verificación

Sin script nuevo: esta fase solo cablea UI sobre server actions ya cubiertas por
`verify:phase0` a `verify:phase4` (autorización, aprobación, puntos, cargos directivos,
misiones, medallas). Verificado en esta fase: `npx tsc --noEmit`, `pnpm build` (29 rutas) y
`pnpm lint` limpios (mismo error preexistente no relacionado en `hooks/use-mobile.ts`, más un
error de comillas sin escapar que se corrigió en `admin/organization/page.tsx`).

## Estado final del proyecto

Con esta fase se completan las 6 fases del plan (`docs/FASE-0` a `FASE-5`). Fuera de alcance,
explícitamente diferido según lo acordado al inicio: el módulo 3D (Blender + React Three
Fiber) — 0% implementado, se planeará aparte cuando existan los assets.
