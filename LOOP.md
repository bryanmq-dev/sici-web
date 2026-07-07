# LOOP.md — SICI Web × TestSprite CLI

Registro del loop escribir → verificar → arreglar → verificar de nuevo, contra la app en vivo
(`https://soceisi.com`), usando la TestSprite CLI (`testsprite test create --plan-from ... --run --wait`).
Proyecto TestSprite: `SICI Web` (`e2de8d20-c29c-4a63-a3fd-173c7e4b829b`).

## Iteración 1 — 2026-07-06

- **Maker**: Claude Code arregló varios bugs reales reportados por el dueño del proyecto:
  bug de cascada CSS (`.input`/`.btn*` sin `@layer`, hacía que Tailwind `pl-10`/`px-8` fueran
  ignorados — placeholder e ícono superpuestos en el login), navbar sin botón de "Panel Admin"
  ni "Cerrar sesión", redirect de logout apuntando a `localhost:3000` en producción (por
  `AUTH_URL` mal configurado en `docker-compose.yml`), y la página de registro (`/join`) con un
  sistema de diseño completamente distinto al del login.
- **Verify**: `testsprite test create --plan-from plan-iter1-public.json --run --wait` contra
  `https://soceisi.com` (test `b7b68911-0250-4ae3-a419-c75994c9d8d8`, run
  `e38a0610-31cb-46ac-85d8-725a7b47b698`).
- **Resultado**: `BLOCKED`, no `FAILED` — la corrida real encontró algo más urgente que los bugs
  de UI que buscábamos: `soceisi.com` estaba devolviendo **502 Bad Gateway (Cloudflare)** en ese
  momento, un incidente de infraestructura no relacionado con este fix. Confirmado también con
  `curl` directo. Video de la corrida:
  https://testsprite-videos.s3.us-east-1.amazonaws.com/9458f498-1081-707c-2952-80ada2965cb4/1783369246686186//tmp/2b248ba7-f511-42fc-bca5-ba1fca9c39e4/result.webm
- **Nota de seguridad**: se intentó incluir en el mismo test un login autenticado (para probar
  el botón "Panel Admin" y "Cerrar sesión" en el navbar) usando una cuenta admin real. El
  clasificador de seguridad de Claude Code bloqueó el intento — enviar una contraseña real de
  producción en texto plano a la nube de un tercero (TestSprite) es un riesgo de exfiltración de
  credenciales, sin importar el consentimiento. Se decidió esperar el redeploy y crear una
  cuenta descartable dedicada solo para pruebas antes de correr los checks autenticados.
- **Fix**: pendiente de que se redespliegue el sitio (el 502 es un problema de infraestructura,
  no de código — se está diagnosticando por separado). Los arreglos de UI ya están hechos y
  verificados localmente (`tsc`, `pnpm build`, `pnpm lint` limpios).
- **Verify again**: pendiente — se re-correrá el mismo test en cuanto el sitio vuelva a
  responder, y se añadirá un segundo test autenticado con una cuenta desechable.

## Iteración 2 — 2026-07-07

- **Maker**: desde la Iteración 1 se arregló el 502 (Dockerfile de producción corría `next dev`
  en vez de un build real, más un bug de tracing standalone+Edge Runtime que rompía `/admin`),
  el bug de cascada CSS del login, y se rediseñaron `/join`, `/articles`, `/projects`,
  `/forum`, `/mentorship` quitando el tema cyberpunk viejo.
- **Verify**: `testsprite test create --plan-from plan-iter2.json --run --wait` contra
  `https://soceisi.com` (test `593ed4a2-718d-4e06-8b16-5c7fe030041d`, run
  `8f9c497d-536f-4401-9056-e132085cab42`).
- **Resultado**: `BLOCKED`, 11/12 pasos pasaron. `/login` (placeholder legible), `/join` (mismo
  sistema de diseño que login, con campos de contraseña/confirmación), `/articles` (título,
  buscador, botón "Publicar Artículo"), `/projects` y `/forum` (sin texto residual tipo
  "SICI_NETWORK"/"_V1.0") — todos pasaron. El paso de `/mentorship` falló: el agente de
  TestSprite navegó a `/mentores` (una URL que no existe, no la que se le pidió) y vio un 404.
  Video: https://testsprite-videos.s3.us-east-1.amazonaws.com/9458f498-1081-707c-2952-80ada2965cb4/1783385456299551//tmp/fb70f8ba-2ab0-4645-8c66-1555a74a627a/result.webm
- **Diagnóstico**: se revisó el código en busca de un link roto a `/mentores` (confusión
  razonable dado que sí existe una página real `/mentors` — "Red de Mentores" — separada de
  `/mentorship` — "Hub de Mentorías"). No existe ningún `href="/mentores"` en el código; fue
  el agente de IA el que adivinó mal la URL en vez de seguir la instrucción literal. No es un
  bug del sitio.
- **Fix**: no aplica (no había nada que arreglar en el código) — se reescribió el paso de plan
  para forzar navegación directa por URL exacta, sin ambigüedad.
- **Verify again**: `testsprite test create --plan-from plan-iter2b.json --run --wait` (test
  `1ea1256e-b02d-436f-826b-70c922781e69`, run `c8ecdb4e-0a00-4191-a893-8ba336d92622`) →
  `PASSED`, 5/5 pasos. `/mentorship` carga correctamente, con el encabezado "Hub de Mentorías"
  y sin texto residual. Video:
  https://testsprite-videos.s3.us-east-1.amazonaws.com/9458f498-1081-707c-2952-80ada2965cb4/1783385599215857//tmp/489dbfd8-07e3-42b8-869b-793fa46a2db1/result.webm

## Iteración 3 — 2026-07-07

- **Maker**: N/A al momento de correr (el bug se descubrió en esta misma iteración).
- **Verify**: `testsprite test create --plan-from plan-iter3.json --run --wait` contra
  `https://soceisi.com`, login con `admin@ejemplo.edu` (credencial de prueba desechable, dada
  por el dueño del proyecto) (test `3e684102-3514-40b8-a3f3-61558521a5cb`, run
  `61e306d7-d0ad-4d5d-85ad-fefd3b5cec07`).
- **Resultado**: `FAILED`. Login como admin funcionó, `/admin` cargó el dashboard real (ya no
  el 500 de antes), y el ítem activo del sidebar sí aparece resaltado. Pero **no se encontró
  ningún botón "Cerrar sesión" visible en la barra superior** — el agente probó incluso un menú
  flotante alterno y no lo halló. Video:
  https://testsprite-videos.s3.us-east-1.amazonaws.com/9458f498-1081-707c-2952-80ada2965cb4/1783386323793822//tmp/9670b0c8-3466-4983-9110-ce152a235b25/result.webm
- **Diagnóstico**: bug real. `app/admin/layout.tsx` nunca renderiza el `<Navbar />` compartido
  (donde sí se había agregado "Cerrar sesión" en un fix anterior) — el panel admin tiene su
  propio shell de solo sidebar, con un único link "Volver al Sitio" que además reusaba el ícono
  `LogOut` sin ejecutar ningún `signOut()` real.
- **Fix**: nuevo `app/admin/AdminLogoutButton.tsx` (client component, `signOut({ callbackUrl:
  '/login' })`) añadido al sidebar del admin, debajo de "Volver al Sitio" (que ahora usa el
  ícono `ArrowLeft`, no `LogOut`, para no confundir). Commit `0ea37d5`.
- **Verify again**: pendiente de redeploy — se re-correrá el mismo test en cuanto el fix esté
  en producción.

## Iteración 4 — 2026-07-07

- **Maker**: N/A al momento de correr (bloqueo de datos, no de código).
- **Verify**: dos intentos con `student@est.univalle.edu` (credencial de prueba desechable):
  1. `testsprite test create --plan-from plan-iter4.json` (test
     `a66cc189-b291-486c-8a2b-4a87c2ae31bd`) — el runner de TestSprite condensó el plan de 21
     pasos en solo 3 y marcó `passed` sin haber iniciado sesión ni probado ningún flujo
     autenticado; se descartó como verificación inválida (falso positivo del runner, no del
     sitio) y se dividió en tests más chicos y explícitos.
  2. `testsprite test create --plan-from plan-iter4b.json --run --wait` (test
     `3ba3f99c-efc0-4541-a0a8-e373c352a85e`, run `f3f9be53-8be6-429d-93ce-eae9a7a71755`) →
     `BLOCKED`.
- **Resultado**: el login con `student@est.univalle.edu` mostró "Tu solicitud de ingreso está
  en revisión. Te avisaremos por correo cuando sea aprobada." — la cuenta de prueba está en
  estado `postulacion`, sin aprobar. Video:
  https://testsprite-videos.s3.us-east-1.amazonaws.com/9458f498-1081-707c-2952-80ada2965cb4/1783386938668446//tmp/3c8942c6-65cd-4d53-8d61-944aa5be694d/result.webm
- **Diagnóstico**: no es un bug — es exactamente el comportamiento esperado del flujo de
  solicitud de ingreso (Iteración previa de desarrollo), confirmando además que el bloqueo de
  login por estado funciona correctamente en producción. La cuenta de prueba simplemente
  necesita que un admin la apruebe desde `/admin/users`.
- **Fix**: no aplica al código — se le pidió al dueño del proyecto que apruebe la cuenta de
  prueba desde el panel admin.
- **Verify again**: pendiente de que la cuenta quede aprobada y de que el fix de la Iteración 3
  esté en producción.

<!-- Las siguientes iteraciones se agregan aquí conforme el loop real continúa. -->
