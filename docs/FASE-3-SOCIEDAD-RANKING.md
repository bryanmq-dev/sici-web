# Fase 3 — Sociedad, Ranking, cargos directivos

Construida sobre [[FASE-0-SEGURIDAD-FUNDAMENTOS]]. Esta fase termina de migrar el ranking al
puntaje unificado `isiPoints` introducido en Fase 0.

## Cargos directivos

- `users.gender` (nullable) — se setea al asignar un cargo directivo, usado para el título
  dinámico.
- `lib/constants/organization.ts`: `DIRECTIVE_ROLES` (Presidente, Vicepresidente, Secretario de
  Directiva, Secretario de Investigación, Secretario de RSU e Interacción Social, Secretario de
  Relaciones, Secretario de Deportes y Cultura, Vocal) y `MAX_VOCAL_SEATS = 2`.
- `genderizeTitle(title, gender)` en `lib/utils.ts` — reemplaza la terminación "o" de la
  primera palabra por "a" si `gender === 'F'` (Secretario→Secretaria). "Vocal" no cambia (la
  palabra es invariante en español); "Presidente" tampoco (el spec solo pide dinamismo para
  "secretario(a)", literal).
- `assignDirectiveRole({userId, role, gender})` (`requireAdmin`, transacción): valida `role`
  contra `DIRECTIVE_ROLES`, valida máximo 2 "Vocal" activos, valida que cargos no-Vocal no
  tengan ya un ocupante activo distinto, crea la unidad "Directiva" si no existe, inserta la
  membresía y **otorga rol admin** al usuario.
- `removeDirectiveRole(membershipId)` (`requireAdmin`, transacción): desactiva la membresía y,
  **solo si el usuario no queda con ningún otro cargo directivo activo**, revierte su rol a
  `student` (decisión confirmada con el usuario: el admin queda atado al cargo, no es
  permanente).
- Verificado: un 3er "Vocal" se rechaza; asignar cargo otorga admin; remover el único cargo
  revoca admin.

## Ranking unificado

- `getRankingUsers()` ahora ordena por `isiPoints` (antes ordenaba por `devScore`, ignorando
  `researchScore` — el spec pide "olvídate de research points, [isipoints] son puntos
  generales para todo").
- `RankingPodiumCard`/`RankingListItem`/`RankingClient` se simplificaron: se eliminó el
  selector de categoría "DevCore / Insight Points" (dos rankings paralelos) — ahora hay un solo
  podio y una sola lista, ordenados por `isiPoints`, con el nivel (`getLevelForPoints`) como
  subtítulo en vez de dos badges de rango separados.
- `lib/constants/levels.ts`: 5 niveles fijos (Junior, Dev Master, Gonzalord, Quantum Coder,
  SENIOR SOCEISI) con umbrales de puntos placeholder (0/500/1500/3500/7000) — trivialmente
  ajustables en un solo archivo sin tocar el resto del código.

## Sociedad (`/team`)

- `getSocietyMemberships()` ahora trae `userGender`; `TeamClient.tsx` aplica
  `genderizeTitle(member.role, member.userGender)` al renderizar el cargo.
- La agrupación por unidad ya existía y funciona sin cambios: como `getSocietyUnits()` ordena
  alfabéticamente, "Directiva" ya aparece primero de forma natural (antes que Incubadora,
  Investigación, Mentores).

## Verificación

`pnpm verify:phase3`: `genderizeTitle` correcto en los 4 casos (F/M/Vocal/Presidente); tope de
2 Vocales rechaza el 3ro; asignar cargo otorga admin; remover el único cargo lo revoca.
`npx tsc --noEmit`, `pnpm build` y `pnpm lint` limpios (mismo error preexistente no relacionado).

## Fuera de alcance de esta fase

La UI de admin para `assignDirectiveRole`/`removeDirectiveRole` (formulario con selector de
cargo y género) se conecta en Fase 5 — por ahora las actions existen y están probadas, pero
solo son invocables desde el admin panel una vez se construya esa pantalla.
