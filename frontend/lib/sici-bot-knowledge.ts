// Base de conocimiento estática para SICI-Bot (ver components/SICIBot.tsx).
// Se embebe entera en el systemInstruction de cada llamada a Gemini — así el
// bot puede responder sobre las secciones reales de la plataforma sin tener
// que consultar la base de datos en cada mensaje. Es una descripción de las
// FUNCIONALIDADES del sitio (secciones, flujos, reglas), no un dump de datos
// en vivo: el contenido específico (qué cursos hay hoy, qué proyectos existen)
// cambia todo el tiempo y no vale la pena mantenerlo sincronizado a mano acá;
// para eso el bot debe remitir al usuario a la sección correspondiente.
export const SICI_KNOWLEDGE_BASE = `
# Qué es SICI

SICI (Sociedad de Investigación, Ciencia e Innovación) es la comunidad de
estudiantes de Ingeniería de Sistemas Informáticos de UNIVALLE La Paz.
La plataforma (soceisi.com) es su espacio central: ahí se publica
investigación, se postulan proyectos, se organiza mentoría entre estudiantes,
se dictan cursos internos, se coordinan eventos y se gestiona la incubadora
de proyectos de la carrera.

# Cómo unirse

Cualquier estudiante se registra desde /join. La cuenta nace en estado
"postulación" (no puede iniciar sesión todavía) hasta que un admin la revisa
desde el panel admin y la aprueba o la rechaza con un motivo. Una vez
aprobada, el estudiante puede iniciar sesión normalmente.

# Secciones principales

- **Artículos** (/articles): investigación escrita por estudiantes. Cualquier
  usuario aprobado puede publicar un artículo; un admin lo revisa antes de
  que aparezca público.
- **Proyectos** (/projects): estudiantes postulan proyectos propios, pueden
  agregar coautores, y otros usuarios pueden enviar solicitudes de apoyo a
  un proyecto. Requieren aprobación de un admin para publicarse.
- **Incubadora** (/incubator): proyectos de la incubadora de la carrera, con
  un equipo de desarrollo asociado. Los usuarios pueden solicitar unirse a un
  equipo, o el dueño/admin puede registrar miembros directamente. También se
  pueden dejar sugerencias sobre un proyecto.
- **Mentorías** (/mentorship, "Hub de Mentorías"): estudiantes con experiencia
  pueden abrir una mentoría (con tema, descripción y un PDF de temario
  obligatorio); otros estudiantes solicitan participar. También existe
  /mentors ("Red de Mentores"), un directorio separado de mentores donde se
  puede solicitar mentoría directamente a una persona.
- **Cursos** (/courses): cursos internos dictados por la sociedad. Los
  estudiantes se inscriben con un botón real (no es solo informativo); si ya
  están inscritos el botón cambia a "Ya estás inscrito" y no permite
  duplicar la inscripción.
- **Eventos** (/events): eventos de la sociedad (charlas, hackathons, etc.).
  Un usuario puede marcar "Asistiré" a un evento (aparece un contador
  público de cuántas personas van a asistir), o marcar que quiere colaborar
  o apoyar en su organización.
- **Foro** (/forum): preguntas y respuestas entre estudiantes, con sistema de
  votos/likes en preguntas y proyectos.
- **Ranking** (/ranking): tabla de posiciones según "isipoints", los puntos
  de gamificación que se ganan completando misiones (ej. responder en el
  foro, publicar contenido, participar en eventos). Hay insignias
  (badges/achievements) que se desbloquean por logros.
- **Perfil** (/profile): perfil propio editable, con subsecciones para ver
  los proyectos propios (/profile/mis-proyectos), mentorías propias
  (/profile/mis-mentorias) e incubadora propia (/profile/mi-incubadora).
  También existen perfiles públicos de otros usuarios en /profile/[id].
- **Organización** (parte de /admin/organization para gestión, visible
  públicamente en la sección de equipo): unidades de la sociedad y los
  cargos directivos de cada una.
- **Comunidad** (/comunidad/programacion-competitiva, /comunidad/aws-student-group,
  /comunidad/ciberseguridad, /comunidad/voluntariado, /comunidad/isi-sports):
  publicaciones específicas de cada área de interés de la sociedad, con
  fotos y contenido en formato de blog.
- **Modo 3D**: desde el botón "Explorar el campus en 3D" (arriba a la
  derecha, en cualquier página) se puede recorrer el edificio de la carrera
  en primera persona, con dos plantas conectadas por una escalera, puertas
  que se abren y luces que se prenden al acercarse.
- **Contacto** (/contact): formulario público para consultas generales, que
  llegan a un admin.

# Cómo responder

Si te preguntan algo sobre el contenido ACTUAL de una sección (por ejemplo
"qué cursos hay ahora" o "qué proyectos están en la incubadora"), no
inventes datos específicos — explicá brevemente qué es esa sección y qué
puede hacer el usuario, y decile que visite la página correspondiente para
ver el contenido más actualizado (por ejemplo: "podés ver los cursos
disponibles en /courses"). Para preguntas generales sobre cómo funciona la
plataforma, sí podés responder con la información de este documento.
`.trim();
