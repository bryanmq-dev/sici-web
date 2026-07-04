# Fase 4 — Mi Perfil (Dashboard + Perfil, DB-backed)

La brecha más grande del proyecto: `/profile` y `/profile/[id]` eran client components que leían
de datos mock (`lib/data`) — ni siquiera comprobaban sesión (`isOwnProfile` estaba **hardcodeado
a `true`**, cualquiera veía controles de edición en el perfil de cualquiera). Reescritos de cero.

## Puntaje unificado

- `users.devScore`/`researchScore` **eliminados** — todos los call sites ya migraron a
  `isiPoints`/`awardPoints` en fases anteriores. `quests.devReward`/`researchReward`
  eliminados también, reemplazados por `pointsReward` único (backfill: suma de ambos).
  Migración en 2 pasos por la misma razón que en Fase 2 (`db:push` no soporta rename
  ambiguo sin TTY): agregar columnas nuevas → backfill con SQL → recién ahí `DROP COLUMN`.
- `RankingPodiumCard`/`RankingListItem` de Fase 3 y ahora `DashboardClient`/`ProfileClient`
  todos leen `isiPoints` + `getLevelForPoints` — cero referencias a dev/research score
  restantes en código productivo.

## Misiones siempre activas (sin "aceptar misión")

- `quests` gana `triggerType`/`triggerThreshold` (condición de auto-progreso).
- `lib/quest-engine.ts` — `checkAndProgressQuests(userId, actionType, incrementBy)`: busca
  quests activas con ese `triggerType`, hace upsert de `userQuests` incrementando progreso, y
  al llegar al umbral marca `completed` + `awardPoints` (una sola vez — una 4ta llamada tras
  completar no vuelve a pagar, verificado).
- Conectado en 3 puntos representativos: `approveProject` → `project_approved`,
  `approveArticle` → `article_approved`, `createForumAnswer` → `forum_answer_posted`. El
  patrón es uniforme (una línea `await checkAndProgressQuests(userId, 'trigger')` tras el
  evento) y extensible a más acciones sin tocar el motor.
- `acceptQuest`/`updateQuestProgress` **eliminados** de `gamification.ts` (contradecían "no se
  tengan que activar misiones, que siempre estén activas" del spec). El botón "Aceptar Misión"
  del dashboard se eliminó junto con ellos.

## Medallas acumulables

- `userBadges` gana `count` (default 1) + índice único `(userId, badgeId)`.
- `unlockOrIncrementBadge(userId, badgeName)` — `onConflictDoUpdate` incrementa `count` en vez
  de duplicar fila. Verificado: 4 llamadas para la misma medalla → 1 fila con `count=4`.
- Aún no hay ningún punto del código que dispare esto automáticamente por hitos (mentoría x4,
  etc. — mencionado en Fase 2 como diferido a esta fase); la primitiva ya existe y está
  probada, conectar los triggers concretos queda para cuando se definan las medallas de hito
  en el seed de gamificación.

## Mi Perfil — Dashboard

- `/dashboard` (ya existía, ahora corregido): tabs Vista General, Misiones, Insignias,
  **Eventos** (nueva — misiones especiales ligadas a `event_participants` de Fase 1, distinta
  de la sección pública de Eventos), **Nivel** (nueva — los 5 niveles con el actual resaltado).
  Insignias muestran el contador `x{count}` cuando es mayor a 1.

## Mi Perfil — Perfil

- `lib/actions/profile.ts` (nuevo): `getUserContributions` (fan-out sobre projects/articles/
  incubatorProjects/mentorshipRequests/forumQuestions filtrado por autor),
  `updateUserBio`/`updateUserSocials`/`updateUserAvatar`/`addUserSkill`/`removeUserSkill` —
  **todas** derivan el usuario de `requireAuth()`, ninguna acepta `userId` como parámetro
  (mismo patrón de Fase 0). `removeUserSkill` verifica que la skill sea del usuario antes de
  borrar (hueco que se habría colado si no se replicaba el patrón).
- `users.userSkills` (nueva tabla) — solo nombres, sin nivel/seniority, como pide el spec
  explícitamente.
- `EditProfileModal.tsx` — antes hacía `console.log('Saving profile')` y nunca guardaba nada;
  ahora llama a las actions reales, con subida de avatar real vía `uploadImage`
  (`lib/actions/uploads.ts` de Fase 2, reutilizado).
- `/profile/page.tsx` y `/profile/[id]/page.tsx` — server components DB-backed, comparten
  `ProfileClient.tsx`. La versión de otro usuario (`/profile/[id]`) calcula
  `isOwnProfile = session.user.id === user.id` de verdad — cierra el bug de `isOwnProfile = true`
  hardcodeado. Los datos pasados al client component excluyen `passwordHash` explícitamente
  (se seleccionan campos, no se pasa la fila cruda de `users`).
- `components/ProfileSidebar.tsx` (nuevo) — sidebar con Dashboard/Perfil/Mis Proyectos/Mis
  Mentorías/Mi Incubadora, spec: "en sección Mi Perfil debe haber un sidebar con todas las
  opciones de la app... para ver las propias del estudiante".
- `/profile/mis-proyectos`, `/profile/mis-mentorias`, `/profile/mi-incubadora` (nuevas) —
  agregan lo propio del usuario (como creador y como participante) y enlazan a los detalles de
  Fases 1-2 donde ya vive la UI completa de gestión (aprobar solicitudes, evaluar, finalizar)
  — evita duplicar esa lógica.

## Dark mode sin tinte azul

`app/globals.css` `.dark` usaba la paleta `slate` de Tailwind (`#0F172A`/`#1E293B`, azulados).
Reemplazada por `neutral` (`#0A0A0A`/`#171717`) + acento `tertiary` cambiado de `sky-400` a
`amber-500` (ningún azul en el tema oscuro). `--primary` (rojo) sin cambios. Solo custom
properties CSS, cero componentes tocados.

## Verificación

`pnpm verify:phase4`: 3 disparos de una quest con umbral 3 → progreso 33%→67%→100%, se marca
`completed`, se paga una sola vez (una 4ta llamada no repaga); 4 llamadas a
`unlockOrIncrementBadge` con la misma medalla → 1 fila con `count=4`. `npx tsc --noEmit`,
`pnpm build` (33 rutas) y `pnpm lint` limpios.

## Fuera de alcance de esta fase

`app/admin/gamification` (CRUD de badges/quests, otorgar puntos manual, visor del ledger) y
`app/admin/users` (edición real, hoy solo lectura) se completan en Fase 5.
