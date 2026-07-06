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

<!-- Las siguientes iteraciones se agregan aquí conforme el loop real continúa. -->
