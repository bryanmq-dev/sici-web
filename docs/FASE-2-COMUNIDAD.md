# Fase 2 — Comunidad (Incubadora, Formación Contínua, Foro, placeholders)

Construida sobre [[FASE-0-SEGURIDAD-FUNDAMENTOS]] y [[FASE-1-INVESTIGACION]].

## Incubadora

- `incubatorProjects.status` (etapa del pipeline: Idea→Lanzado) se mantiene; nueva columna
  `approvalStatus` separada para el gate de admin (nace `pending`).
- **El `team jsonb` se normalizó** en la nueva tabla `incubator_team_members` (userId, role
  dev/admin, finalScore). Migración de datos real (no solo de esquema): las 6 filas de equipo
  existentes en el jsonb se migraron con SQL directo antes de eliminar la columna —
  `db:push` no soporta rename/drop interactivo sin TTY, así que la migración se hizo en 2 pasos
  (agregar tablas nuevas → migrar datos con SQL → recién ahí `DROP COLUMN team`).
- Nuevas tablas `incubator_join_requests` (solicitar unirse) e `incubator_suggestions`
  (proponer tipo de proyecto).
- `createIncubatorProject` inserta automáticamente al creador como `incubator_team_members`
  con `role='admin'` (el creador administra el proyecto dentro de la incubadora, por spec).
- `approveIncubatorProject`/`rejectIncubatorProject`, `requestToJoin`/`respondToJoinRequest`,
  `setTeamMemberRole`, `evaluateTeamMember` (`awardPoints` proporcional al score).
- UI: `/incubator/[id]` nueva (no existía) — equipo, cola de solicitudes para el dueño, botón
  "Solicitar unirse". Se corrigió además un bug preexistente: el botón "Ver Detalles" de
  `IncubatorProjectCard` enlazaba a `/projects/[id]` en vez de `/incubator/[id]`.

## Formación Contínua (Mentoría)

- `mentorshipRequests` gana `kind` (open/request), `approvalStatus`, `syllabusUrl` (obligatorio
  si `kind='open'`, validado con `.refine` de Zod), `rating`/`ratingComment`.
- Categorías estilo Notion: `mentorship_categories` + `mentorship_category_links`, con
  `findOrCreateCategory(name)` — creación inline si la categoría no existe. Verificado que 15
  llamadas concurrentes creando la misma categoría nueva no producen duplicados (constraint
  único + `onConflictDoNothing` + fallback de lectura).
- Nueva tabla `mentorship_participants` (leader/mentee, attendanceConfirmed, evaluationScore).
- `createMentorship` bifurca por `kind`; para `kind='open'` inserta al creador como
  `role='leader'`. `finishOpenMentorship` (solo el líder): transacción que evalúa a cada
  mentee y otorga puntos (líder 80, mentee 20 c/u). `completeRequestMentorship`/
  `cancelRequestMentorship` (solo quien solicitó): otorga puntos a ambos lados al completar
  (solicitante 15, mentor 40) y guarda la calificación.
- UI: modal existente se dividió en 2 botones ("Solicitar Mentoría" / "Abrir Mentoría") con
  subida real de PDF (`uploadMentorshipSyllabus`, nueva `lib/actions/uploads.ts` sobre
  `lib/upload.ts` de Fase 0) cuando `kind='open'`. Nueva `/mentorship/[id]` — no existía
  ninguna página de detalle (el botón decía "VER_DETALLES_Y_CHAT" y no enlazaba a nada).

## Foro

- `forumAnswers` gana `parentReplyId` (auto-referencia nullable) — una respuesta con
  `parentReplyId` es una respuesta a otra respuesta (nivel 2). El tope de 2 niveles se valida
  en `createForumAnswer` (rechaza si el padre ya tiene, a su vez, un padre), no en la DB.
- Puntos conectados: crear pregunta (+1), crear respuesta (+3), respuesta aceptada (+50, y se
  notifica el hito la primera vez que a un usuario le aceptan una respuesta — se chequea
  contra `points_ledger`), like a una respuesta (+2 al autor, dentro de la misma transacción
  de `toggleLike`, sin auto-like).
- Nueva `markAnswerAccepted(questionId, answerId)` — antes el botón de "marcar como destacada"
  en `ForumDetailClient.tsx` solo cambiaba estado local (`setFeaturedId`) sin persistir nada, y
  `isQuestionAuthor` estaba **hardcodeado a `true`** (cualquiera podía ver el botón). Ambos
  corregidos: el check de autoría usa la sesión real y el click llama a la action real.
- UI de respuestas ahora renderiza los 2 niveles (respuestas anidadas con indentación) con un
  botón "Responder" por respuesta de nivel 1.
- Categorías del foro se mantienen como `tags text[]` freeform — el spec no pide el sistema
  Notion-like acá, solo en mentoría (YAGNI).

## Secciones placeholder de Comunidad

`components/ComingSoon.tsx` + 5 rutas bajo `/comunidad/*` (programacion-competitiva,
aws-student-group, ciberseguridad, voluntariado, isi-sports) — sin backend, solo UI
"Sección en desarrollo". El dropdown "Comunidad" del navbar absorbió el dropdown "Desarrollo"
(Incubadora, Mentorías) por indicación del spec, y agrega las 5 secciones nuevas. Las URLs
existentes (`/incubator`, `/mentorship`, `/forum`, `/courses`, `/ranking`, `/mentors`) no se
movieron.

## Verificación

`pnpm verify:phase2`: proyectos de incubadora y mentorías pending no aparecen en listados
públicos; 15 creaciones concurrentes de la misma categoría nueva producen exactamente 1 fila.
`npx tsc --noEmit`, `pnpm build` (30 rutas) y `pnpm lint` limpios (mismo error preexistente no
relacionado en `hooks/use-mobile.ts`).

## Fuera de alcance de esta fase

Medallas (badges) por hitos de mentoría/foro mencionadas en el spec ("Uno para todos x4") no
se implementan aún — el sistema actual de `userBadges` no es acumulable; el diseño stackable
(`count` + `onConflictDoUpdate`) es explícitamente de Fase 4. Otorgar esas medallas ahora
significaría reescribirlo dos veces. La UI de aprobación en `/admin/incubator` y
`/admin/mentorship` (tab "Pendientes") se conecta en Fase 5.
