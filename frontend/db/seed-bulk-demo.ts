import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { eq, inArray } from 'drizzle-orm';
import dotenv from 'dotenv';
import {
  users, articles, projects, projectCoAuthors, projectSupportRequests,
  events, eventParticipants, eventGalleryImages,
  incubatorProjects, incubatorTeamMembers, incubatorJoinRequests, incubatorSuggestions,
  mentors, mentorshipRequests, mentorshipParticipants,
  courses, courseEnrollments,
  forumQuestions, forumAnswers,
  achievements, badges, userBadges, quests, userQuests, pointsLedger,
  societyUnits, societyMemberships,
  contentLikes, notifications,
} from './schema';

dotenv.config({ path: '.env' });

// Ingesta masiva de datos de demo para la plataforma, de cara al jurado del hackathon.
// ~25 registros por sección salvo en catálogos donde 25 sería irreal para una sola
// sociedad estudiantil (badges/quests/unidades de organización) — ahí se prioriza
// realismo sobre el número exacto, compensando con más filas de asignación
// (userBadges/userQuests/societyMemberships) que sí llegan a ~25.
// Imágenes: picsum.photos con seed fijo por ítem (deterministico, sin subir binarios).
// PDFs: el mismo dummy.pdf público que ya usaba db/seed-content.ts.

const PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const img = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const pick = <T,>(arr: readonly T[], i: number) => arr[i % arr.length];
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86400000);

const FIRST_NAMES = ['Valeria', 'Mateo', 'Camila', 'Sebastián', 'Renata', 'Adrián', 'Luciana', 'Diego', 'Sofía', 'Iván', 'Micaela', 'Rodrigo', 'Daniela', 'Gonzalo', 'Paula', 'Emilio', 'Andrea', 'Joaquín', 'Fernanda', 'Marcelo', 'Ximena', 'Tomás', 'Carla', 'Nicolás'];
const LAST_NAMES = ['Quispe', 'Mamani', 'Choque', 'Fernández', 'Rojas', 'Aguilar', 'Vargas', 'Herrera', 'Paredes', 'Callisaya', 'Torrez', 'Guzmán', 'Flores', 'Condori', 'Zambrana'];

const TECH_AREAS = ['Inteligencia Artificial', 'Ciberseguridad', 'Blockchain', 'IoT', 'Cloud Computing', 'DevOps', 'Redes', 'Robótica', 'Ciencia de Datos', 'Ingeniería de Software'];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: { users, mentors, badges, quests, societyUnits } });

  console.log('🌱 Ingesta masiva de demo — iniciando...');

  // ---------------------------------------------------------------------
  // Usuarios: las 3 cuentas reales ya usadas en LOOP.md + 22 sintéticas más
  // para dar variedad de autores/participantes (pool de 25).
  // ---------------------------------------------------------------------
  const realEmails = ['admin@ejemplo.edu', 'student@est.univalle.edu', 'student2@est.univalle.edu'];
  const realUsers = await db.query.users.findMany({ where: inArray(users.email, realEmails) });
  if (realUsers.length !== 3) {
    console.error('❌ No se encontraron las 3 cuentas reales (admin@ejemplo.edu, student@est.univalle.edu, student2@est.univalle.edu). Abortando.');
    process.exit(1);
  }
  const adminUser = realUsers.find((u) => u.email === 'admin@ejemplo.edu')!;

  const demoPassword = await bcrypt.hash('demo12345', 10);
  const syntheticSeed = Array.from({ length: 22 }, (_, i) => {
    const first = pick(FIRST_NAMES, i);
    const last = pick(LAST_NAMES, i + 3);
    return {
      email: `demo.${first.toLowerCase()}.${last.toLowerCase()}${i}@est.univalle.edu`,
      name: `${first} ${last}`,
      passwordHash: demoPassword,
      role: 'student' as const,
      bio: `Estudiante de Ingeniería de Sistemas Informáticos, interesado en ${pick(TECH_AREAS, i)}.`,
      semester: (i % 10) + 1,
      status: 'activo',
      avatar: img(`user-${i}`, 200, 200),
      isiPoints: (i * 37) % 900,
    };
  });
  const existingSynthetic = await db.query.users.findMany({ where: inArray(users.email, syntheticSeed.map((u) => u.email)) });
  const missingSynthetic = syntheticSeed.filter((s) => !existingSynthetic.some((e) => e.email === s.email));
  const insertedSynthetic = missingSynthetic.length ? await db.insert(users).values(missingSynthetic).returning() : [];
  const pool25 = [...realUsers, ...existingSynthetic, ...insertedSynthetic];
  console.log(`✅ Usuarios: ${realUsers.length} reales + ${existingSynthetic.length + insertedSynthetic.length} sintéticos = pool de ${pool25.length}`);

  // ---------------------------------------------------------------------
  // Artículos (25)
  // ---------------------------------------------------------------------
  const articleTitles = [
    'Detección de anomalías en tráfico de red con autoencoders',
    'Optimización de contratos inteligentes en Solidity para bajo consumo de gas',
    'Federated Learning aplicado a diagnóstico médico distribuido',
    'Arquitecturas Zero Trust para redes universitarias',
    'Compresión de modelos de lenguaje para dispositivos de borde',
    'Análisis forense digital en entornos de contenedores Docker',
    'Optimización de rutas en flotas IoT mediante algoritmos genéticos',
    'Criptografía post-cuántica: estado del arte y desafíos de adopción',
    'Balanceo de carga adaptativo en microservicios con Kubernetes',
    'Visión por computadora para inspección de calidad en manufactura',
    'Modelos de recomendación híbridos para plataformas educativas',
    'Auditoría de vulnerabilidades en APIs REST con OWASP Top 10',
    'Redes neuronales de grafos para detección de fraude financiero',
    'Migración de monolitos a microservicios: un caso de estudio',
    'Procesamiento de lenguaje natural para análisis de sentimiento en español',
    'Blockchain para trazabilidad de la cadena de suministro agrícola',
    'Sistemas de recomendación basados en aprendizaje por refuerzo',
    'Seguridad en dispositivos IoT de bajo costo: un análisis práctico',
    'Automatización de pipelines CI/CD con GitOps',
    'Reconocimiento facial con privacidad diferencial',
    'Optimización de consultas SQL en bases de datos distribuidas',
    'Ética y sesgos en modelos de inteligencia artificial generativa',
    'Simulación de ataques DDoS y estrategias de mitigación',
    'Computación cuántica: primeros pasos con Qiskit',
    'Desarrollo de gemelos digitales para infraestructura universitaria',
  ];
  const articleStatuses = ['approved', 'approved', 'approved', 'pending'];
  const articleValues = articleTitles.map((title, i) => ({
    title,
    abstract: `Este artículo presenta un estudio sobre ${title.toLowerCase()}, desarrollado por miembros de SICI como parte de la línea de investigación en ${pick(TECH_AREAS, i)}.`,
    content: `# ${title}\n\n## Introducción\n\nEl presente trabajo aborda ${title.toLowerCase()} desde una perspectiva aplicada, con foco en su relevancia para la carrera de Ingeniería de Sistemas Informáticos de UNIVALLE.\n\n## Metodología\n\nSe realizó una revisión bibliográfica y experimentación práctica sobre el tema.\n\n## Resultados\n\nLos resultados preliminares muestran avances significativos en el área de ${pick(TECH_AREAS, i)}.\n\n## Conclusión\n\nEste trabajo sienta las bases para futuras investigaciones en la sociedad.`,
    researchArea: pick(TECH_AREAS, i),
    authorIds: [pool25[i % pool25.length].id],
    pdfUrl: PDF_URL,
    image: img(`article-${i}`, 800, 1200),
    likes: (i * 7) % 60,
    status: pick(articleStatuses, i),
    publicationDate: daysAgo(i * 5).toISOString().slice(0, 10),
  }));
  const insertedArticles = await db.insert(articles).values(articleValues).returning();
  console.log(`✅ Artículos: ${insertedArticles.length}`);

  // ---------------------------------------------------------------------
  // Proyectos (25) + coautores + solicitudes de apoyo
  // ---------------------------------------------------------------------
  const projectTitles = [
    'Plataforma de monitoreo energético para campus inteligente',
    'Asistente virtual para trámites administrativos universitarios',
    'Sistema de votación electrónica basado en blockchain',
    'App de movilidad compartida para estudiantes',
    'Detector de plagio académico con NLP',
    'Sistema de riego inteligente con sensores IoT',
    'Marketplace descentralizado de apuntes universitarios',
    'Plataforma de telemedicina para zonas rurales',
    'Simulador de redes para prácticas de laboratorio',
    'Sistema de reconocimiento de placas vehiculares',
    'Wallet educativa de criptomonedas para principiantes',
    'Chatbot de soporte técnico con IA generativa',
    'Dashboard de analítica académica en tiempo real',
    'Sistema de gestión de biblioteca con RFID',
    'App de accesibilidad para estudiantes con discapacidad visual',
    'Plataforma de crowdfunding para proyectos estudiantiles',
    'Sistema de detección temprana de deserción estudiantil',
    'Red social académica para colaboración entre carreras',
    'Sistema de reservas de laboratorios con QR',
    'Plataforma de mentoría entre pares con matching por IA',
    'Monitor de calidad del aire en el campus',
    'Sistema de gestión de residuos electrónicos universitarios',
    'App de realidad aumentada para tours del campus',
    'Plataforma de certificación de habilidades técnicas',
    'Sistema de predicción de demanda eléctrica del campus',
  ];
  const projectStatuses = ['approved', 'approved', 'approved', 'pending'];
  const projectValues = projectTitles.map((title, i) => ({
    title,
    authorId: pool25[(i + 5) % pool25.length].id,
    description: `${title} — un proyecto desarrollado por estudiantes de SICI enfocado en resolver una necesidad real del campus usando ${pick(TECH_AREAS, i + 2)}.`,
    content: `# ${title}\n\nProyecto desarrollado como parte de las actividades de investigación aplicada de la Sociedad de Investigación, Ciencia e Innovación.`,
    category: pick(TECH_AREAS, i + 2),
    tags: [pick(TECH_AREAS, i), pick(TECH_AREAS, i + 1), 'UNIVALLE'],
    image: img(`project-${i}`, 800, 600),
    likes: (i * 5) % 50,
    featured: i < 4,
    status: pick(projectStatuses, i),
    impactScore: (i * 11) % 100,
    supportSlots: (i % 5) + 1,
  }));
  const insertedProjects = await db.insert(projects).values(projectValues).returning();
  console.log(`✅ Proyectos: ${insertedProjects.length}`);

  const coAuthorValues = insertedProjects.slice(0, 12).map((p, i) => ({
    projectId: p.id,
    userId: pool25[(i + 10) % pool25.length].id,
  })).filter((v) => v.userId !== insertedProjects.find((p) => p.id === v.projectId)?.authorId);
  if (coAuthorValues.length) await db.insert(projectCoAuthors).values(coAuthorValues).onConflictDoNothing();

  const supportRequestValues = insertedProjects.slice(0, 15).map((p, i) => ({
    projectId: p.id,
    userId: pool25[(i + 15) % pool25.length].id,
    message: 'Me gustaría sumarme para aportar en la parte de desarrollo.',
    status: i % 3 === 0 ? 'accepted' : 'pending',
  })).filter((v) => v.userId !== insertedProjects.find((p) => p.id === v.projectId)?.authorId);
  if (supportRequestValues.length) await db.insert(projectSupportRequests).values(supportRequestValues).onConflictDoNothing();
  console.log(`✅ Coautores y solicitudes de apoyo de proyectos`);

  // ---------------------------------------------------------------------
  // Eventos (25) + participantes + galería
  // ---------------------------------------------------------------------
  const eventTitles = [
    'Hackathon SICI 2026: Ciudades Inteligentes', 'Webinar: Fundamentos de Ciberseguridad Ofensiva',
    'Taller de Smart Contracts con Solidity', 'Charla: Carreras en Inteligencia Artificial',
    'Bootcamp de Desarrollo Fullstack', 'Conferencia Anual de Investigación SICI',
    'Taller de Machine Learning con Python', 'Noche de Trivia Tecnológica',
    'Charla: Ética en la IA Generativa', 'Workshop de Arquitectura de Microservicios',
    'CTF Interno de Ciberseguridad', 'Feria de Proyectos de la Incubadora',
    'Taller de Redes Neuronales desde Cero', 'Charla de Egresados: Vida Laboral en Tech',
    'Hands-on: Kubernetes para Principiantes', 'Taller de Diseño UX/UI para Desarrolladores',
    'Charla: Blockchain más allá de las Criptomonedas', 'Sesión de Code Review Colaborativo',
    'Taller de Robótica con Arduino', 'Meetup de Mujeres en Tecnología SICI',
    'Charla: Computación en la Nube con AWS', 'Torneo de Programación Competitiva',
    'Taller de Testing Automatizado', 'Conversatorio: Startups Tecnológicas Bolivianas',
    'Cierre de Gestión SICI 2026',
  ];
  const eventTypes = ['hackathon', 'webinar', 'taller', 'charla', 'conferencia'];
  const eventValues = eventTitles.map((title, i) => {
    const offset = i - 12; // mezcla pasados y futuros
    return {
      title,
      description: `${title} — actividad organizada por SICI para la comunidad de Ingeniería de Sistemas Informáticos de UNIVALLE.`,
      eventDate: offset < 0 ? daysAgo(-offset * 4) : daysFromNow(offset * 4 + 1),
      eventType: pick(eventTypes, i),
      image: img(`event-${i}`, 800, 400),
      location: i % 3 === 0 ? 'Auditorio Principal UNIVALLE' : 'Laboratorio de Sistemas, Campus La Paz',
      status: offset < 0 ? 'completed' : 'upcoming',
      appliesToScore: i % 2 === 0,
      scoreDescription: i % 2 === 0 ? 'Asistencia certificada' : null,
      scorePoints: i % 2 === 0 ? 20 + (i % 5) * 10 : null,
    };
  });
  const insertedEvents = await db.insert(events).values(eventValues).returning();
  console.log(`✅ Eventos: ${insertedEvents.length}`);

  const eventParticipantValues: { eventId: string; userId: string; intent: 'attend' | 'collaborate' | 'support' }[] = [];
  insertedEvents.forEach((e, i) => {
    const intents = ['attend', 'attend', 'attend', 'collaborate', 'support'] as const;
    for (let j = 0; j < (i % 4) + 1; j++) {
      eventParticipantValues.push({ eventId: e.id, userId: pool25[(i + j) % pool25.length].id, intent: pick(intents, i + j) });
    }
  });
  await db.insert(eventParticipants).values(eventParticipantValues).onConflictDoNothing();

  const galleryValues = insertedEvents.filter((e) => e.status === 'completed').slice(0, 8).flatMap((e, i) => [
    { eventId: e.id, imageUrl: img(`gallery-${i}-a`, 800, 600), caption: 'Momento del evento' },
    { eventId: e.id, imageUrl: img(`gallery-${i}-b`, 800, 600), caption: 'Participantes en actividad' },
  ]);
  if (galleryValues.length) await db.insert(eventGalleryImages).values(galleryValues);
  console.log(`✅ Participantes y galería de eventos`);

  // ---------------------------------------------------------------------
  // Incubadora (25 proyectos) + equipo + solicitudes + sugerencias
  // ---------------------------------------------------------------------
  const incubatorTitles = [
    'CampusPay: billetera digital universitaria', 'AgroSense: monitoreo de cultivos con IoT',
    'SafeRoute: rutas seguras para estudiantes', 'StudyBuddy: matching de grupos de estudio con IA',
    'EcoCampus: gestión inteligente de residuos', 'TutorIA: tutor virtual adaptativo',
    'ParkSmart: gestión de estacionamiento universitario', 'HealthTrack: monitoreo de salud estudiantil',
    'CodeReview Bot: revisión automática de código', 'LibreAcceso: accesibilidad digital para el campus',
    'CampusEnergy: optimización energética con ML', 'VotaSeguro: votación estudiantil con blockchain',
    'LinguaBot: práctica de idiomas con IA conversacional', 'JobConnect: bolsa de empleo para egresados',
    'CampusAR: realidad aumentada para orientación', 'DataViz Académico: dashboards para docentes',
    'RecycleTrack: trazabilidad de reciclaje universitario', 'MentorMatch: emparejamiento de mentores',
    'SecureExam: plataforma de exámenes anti-fraude', 'CampusChat: red social interna moderada por IA',
    'BikeShare UNIVALLE: bicicletas compartidas', 'SkillPass: certificación de habilidades blandas',
    'CampusAlert: sistema de alertas de emergencia', 'GreenPrint: cálculo de huella de carbono estudiantil',
    'OpenLab: reserva colaborativa de laboratorios',
  ];
  const incubatorStages = ['Idea', 'Planificación', 'MVP', 'En Desarrollo', 'Lanzado'];
  const incubatorValues = incubatorTitles.map((title, i) => ({
    title,
    authorId: pool25[(i + 3) % pool25.length].id,
    status: pick(incubatorStages, i),
    approvalStatus: 'approved',
    description: `${title} — proyecto de la incubadora SICI que busca resolver una necesidad concreta del campus con tecnología aplicada.`,
    content: `# ${title}\n\nProyecto incubado por SICI, en etapa de ${pick(incubatorStages, i)}.`,
    categories: [pick(TECH_AREAS, i), 'Innovación Estudiantil'],
    technologies: [pick(['React', 'Next.js', 'Python', 'Node.js', 'Flutter', 'Solidity', 'TensorFlow'], i), pick(['PostgreSQL', 'MongoDB', 'Firebase'], i)],
    client: i % 3 === 0 ? 'Dirección de Bienestar Estudiantil' : null,
    image: img(`incubator-${i}`, 1200, 800),
  }));
  const insertedIncubator = await db.insert(incubatorProjects).values(incubatorValues).returning();
  console.log(`✅ Proyectos de incubadora: ${insertedIncubator.length}`);

  const teamValues = insertedIncubator.flatMap((p, i) => {
    const owner = { incubatorProjectId: p.id, userId: p.authorId!, role: 'admin' as const };
    const extra = [{ incubatorProjectId: p.id, userId: pool25[(i + 8) % pool25.length].id, role: 'dev' as const }];
    return i % 2 === 0 ? [owner, ...extra] : [owner];
  }).filter((v, i, arr) => arr.findIndex((x) => x.incubatorProjectId === v.incubatorProjectId && x.userId === v.userId) === i);
  await db.insert(incubatorTeamMembers).values(teamValues).onConflictDoNothing();

  const joinRequestValues = insertedIncubator.slice(0, 15).map((p, i) => ({
    incubatorProjectId: p.id,
    userId: pool25[(i + 18) % pool25.length].id,
    message: 'Me interesa aportar mis habilidades a este proyecto.',
    status: i % 3 === 0 ? 'accepted' : 'pending',
  })).filter((v) => v.userId !== insertedIncubator.find((p) => p.id === v.incubatorProjectId)?.authorId);
  if (joinRequestValues.length) await db.insert(incubatorJoinRequests).values(joinRequestValues).onConflictDoNothing();

  const suggestionValues = Array.from({ length: 25 }, (_, i) => ({
    userId: pool25[i % pool25.length].id,
    title: `Sugerencia para ${pick(incubatorTitles, i)}`,
    description: 'Sería interesante explorar una integración con el sistema de notificaciones de la plataforma.',
    status: i % 4 === 0 ? 'reviewed' : 'pending',
  }));
  await db.insert(incubatorSuggestions).values(suggestionValues);
  console.log(`✅ Equipo, solicitudes de unión y sugerencias de incubadora`);

  // ---------------------------------------------------------------------
  // Mentores (12, catálogo realista) + solicitudes de mentoría (25)
  // ---------------------------------------------------------------------
  const existingMentors = await db.query.mentors.findMany();
  const mentorPoolUsers = pool25.slice(0, 12);
  const mentorValues = mentorPoolUsers
    .filter((u) => !existingMentors.some((m) => m.userId === u.id))
    .map((u, i) => ({
      userId: u.id,
      specialty: pick(TECH_AREAS, i),
      experience: `${3 + (i % 10)} años de experiencia en ${pick(TECH_AREAS, i)} entre proyectos académicos y de industria.`,
      mentorType: i % 3 === 0 ? 'docente' : 'estudiante',
      skills: [
        { name: pick(TECH_AREAS, i), level: 80 + (i % 20) },
        { name: pick(TECH_AREAS, i + 1), level: 70 + (i % 25) },
      ],
      isActive: true,
    }));
  const insertedMentors = mentorValues.length ? await db.insert(mentors).values(mentorValues).returning() : [];
  const allMentors = [...existingMentors, ...insertedMentors];
  console.log(`✅ Mentores: ${allMentors.length}`);

  const mentorshipTopics = [
    'Preparación para entrevistas técnicas', 'Optimización de algoritmos de grafos', 'Diseño de APIs REST escalables',
    'Introducción a arquitectura de microservicios', 'Buenas prácticas de testing en Next.js', 'Fundamentos de seguridad ofensiva',
    'Modelado de datos para machine learning', 'Despliegue continuo con GitHub Actions', 'Patrones de diseño en TypeScript',
    'Optimización de consultas en PostgreSQL', 'Introducción a smart contracts', 'Gestión de estado en React avanzado',
    'Fundamentos de redes y protocolos', 'Construcción de pipelines de datos', 'Preparación de portafolio para egresados',
    'Buenas prácticas de UX para desarrolladores', 'Introducción a contenedores con Docker', 'Fundamentos de criptografía aplicada',
    'Estrategias de debugging avanzado', 'Introducción a Kubernetes en producción', 'Diseño de sistemas distribuidos',
    'Fundamentos de análisis de datos con Python', 'Preparación para certificaciones cloud', 'Buenas prácticas de code review',
    'Introducción al desarrollo de videojuegos',
  ];
  const mentorshipValues = mentorshipTopics.map((topic, i) => {
    const kind = i % 3 === 0 ? 'open' : 'request';
    return {
      studentId: pool25[(i + 6) % pool25.length].id,
      mentorId: kind === 'request' ? allMentors[i % allMentors.length].id : null,
      topic,
      description: `Sesión sobre ${topic.toLowerCase()}, orientada a estudiantes de la carrera interesados en profundizar el tema.`,
      tags: [pick(TECH_AREAS, i)],
      status: pick(['pending', 'accepted', 'completed'], i),
      kind,
      approvalStatus: 'approved',
      syllabusUrl: kind === 'open' ? PDF_URL : null,
    };
  });
  const insertedMentorship = await db.insert(mentorshipRequests).values(mentorshipValues).returning();
  console.log(`✅ Solicitudes/mentorías: ${insertedMentorship.length}`);

  const openMentorships = insertedMentorship.filter((m) => m.kind === 'open');
  const participantValues = openMentorships.flatMap((m, i) => [
    { mentorshipId: m.id, userId: m.studentId!, role: 'mentor' as const, attendanceConfirmed: true },
    { mentorshipId: m.id, userId: pool25[(i + 12) % pool25.length].id, role: 'mentee' as const, attendanceConfirmed: i % 2 === 0 },
  ]).filter((v, i, arr) => arr.findIndex((x) => x.mentorshipId === v.mentorshipId && x.userId === v.userId) === i);
  if (participantValues.length) await db.insert(mentorshipParticipants).values(participantValues).onConflictDoNothing();
  console.log(`✅ Participantes de mentorías abiertas`);

  // ---------------------------------------------------------------------
  // Cursos (25) + inscripciones
  // ---------------------------------------------------------------------
  const courseNames = [
    'Fundamentos de Machine Learning', 'Ciberseguridad Ofensiva Aplicada', 'Desarrollo Web Fullstack con Next.js',
    'Blockchain y Contratos Inteligentes', 'Arquitectura de Microservicios', 'Ciencia de Datos con Python',
    'DevOps y CI/CD en la Práctica', 'Redes y Seguridad Perimetral', 'Desarrollo de Apps Móviles con Flutter',
    'Introducción a la Computación en la Nube', 'Bases de Datos Distribuidas', 'Deep Learning con PyTorch',
    'Ingeniería de Software Ágil', 'Robótica y Sistemas Embebidos', 'UX/UI para Desarrolladores',
    'Testing y Calidad de Software', 'Kubernetes para Producción', 'Introducción a la Criptografía',
    'Análisis de Datos con SQL Avanzado', 'Desarrollo de APIs con GraphQL', 'Seguridad en Aplicaciones Web',
    'Introducción a la Inteligencia Artificial Generativa', 'Fundamentos de IoT', 'Gestión de Proyectos de Software',
    'Introducción a la Computación Cuántica',
  ];
  const courseCategories = ['Inteligencia Artificial', 'Ciberseguridad', 'Desarrollo Web', 'Blockchain', 'Cloud & DevOps'];
  const courseValues = courseNames.map((name, i) => ({
    name,
    description: `${name} — curso interno dictado por la sociedad, con un enfoque práctico orientado a proyectos reales.`,
    duration: `${20 + (i % 6) * 5} horas`,
    instructorId: allMentors[i % allMentors.length].id,
    syllabus: [
      { title: 'Introducción y fundamentos', lessons: ['Conceptos clave', 'Herramientas del curso'] },
      { title: 'Desarrollo práctico', lessons: ['Proyecto guiado', 'Buenas prácticas'] },
    ],
    category: pick(courseCategories, i),
    status: i % 6 === 0 ? 'finished' : 'active',
    image: img(`course-${i}`, 800, 450),
    objective: `Que el estudiante domine los fundamentos de ${name.toLowerCase()}.`,
    results: `Capacidad de aplicar ${name.toLowerCase()} en proyectos reales.`,
    relevantInfo: 'Incluye certificación de la SICI al finalizar.',
  }));
  const insertedCourses = await db.insert(courses).values(courseValues).returning();
  console.log(`✅ Cursos: ${insertedCourses.length}`);

  const enrollmentValues: { courseId: string; userId: string }[] = [];
  insertedCourses.forEach((c, i) => {
    for (let j = 0; j < (i % 5) + 1; j++) {
      enrollmentValues.push({ courseId: c.id, userId: pool25[(i + j + 2) % pool25.length].id });
    }
  });
  await db.insert(courseEnrollments).values(enrollmentValues).onConflictDoNothing();
  console.log(`✅ Inscripciones a cursos`);

  // ---------------------------------------------------------------------
  // Foro (25 preguntas) + respuestas
  // ---------------------------------------------------------------------
  const forumTitleTemplates = [
    '¿Cómo optimizar consultas N+1 en Prisma/Drizzle?', 'Error de CORS al consumir una API externa desde Next.js',
    '¿Cuál es la mejor forma de manejar autenticación con JWT?', 'Problemas de memory leak en un servicio Node.js',
    '¿Cómo estructurar un monorepo con pnpm workspaces?', 'Dudas sobre indexación en PostgreSQL para búsquedas de texto',
    '¿Conviene usar Server Actions o API Routes en Next.js 15?', 'Buenas prácticas para manejar secretos en variables de entorno',
    '¿Cómo prevenir ataques de reentrancy en Solidity?', 'Diferencias entre SSR, SSG e ISR en Next.js',
    '¿Cómo debuggear un deadlock en PostgreSQL?', 'Estrategias para versionar una API REST pública',
    '¿Vale la pena migrar de REST a GraphQL en este proyecto?', 'Problemas de CORS con cookies httpOnly en producción',
    '¿Cómo implementar rate limiting en un servidor Next.js?', 'Dudas sobre Row Level Security en Postgres',
    '¿Qué estrategia de caché conviene para un dashboard con datos en tiempo real?', 'Cómo estructurar tests E2E con Playwright',
    '¿Cómo manejar migraciones de base de datos en producción sin downtime?', 'Buenas prácticas para logging estructurado',
    '¿Cómo optimizar el bundle size de una app Next.js?', 'Dudas sobre WebSockets vs Server-Sent Events',
    '¿Cómo diseñar un sistema de permisos basado en roles (RBAC)?', 'Problemas de hidratación en componentes de Next.js',
    '¿Cómo escalar horizontalmente un servicio con estado?',
  ];
  const forumValues = forumTitleTemplates.map((title, i) => ({
    title,
    description: `Estoy trabajando en un proyecto de la sociedad y me topé con esto: ${title.toLowerCase()} Cualquier ayuda o referencia se agradece.`,
    authorId: pool25[(i + 4) % pool25.length].id,
    tags: [pick(TECH_AREAS, i), pick(['Next.js', 'PostgreSQL', 'Node.js', 'TypeScript', 'Solidity'], i)],
    views: (i * 23) % 900,
    likes: (i * 3) % 30,
    isSolved: i % 3 === 0,
  }));
  const insertedQuestions = await db.insert(forumQuestions).values(forumValues).returning();
  console.log(`✅ Preguntas de foro: ${insertedQuestions.length}`);

  const answerValues = insertedQuestions.flatMap((q, i) => {
    const first = {
      questionId: q.id,
      authorId: pool25[(i + 9) % pool25.length].id,
      content: 'Yo tuve un problema parecido — te recomiendo revisar la documentación oficial y validar la configuración paso a paso antes de asumir que es un bug.',
      likes: (i * 2) % 20,
    };
    return i % 2 === 0 ? [first] : [first, {
      questionId: q.id,
      authorId: pool25[(i + 14) % pool25.length].id,
      content: 'Coincido con lo anterior, y agregaría que conviene revisar los logs del servidor para descartar errores silenciosos.',
      likes: (i * 1) % 12,
    }];
  });
  await db.insert(forumAnswers).values(answerValues);
  console.log(`✅ Respuestas de foro`);

  // ---------------------------------------------------------------------
  // Gamificación: catálogo realista + asignaciones ~25
  // ---------------------------------------------------------------------
  const existingBadges = await db.query.badges.findMany();
  const badgeCatalog = [
    { name: 'Early Adopter', icon: 'Zap', rarity: 'RARE', description: 'Miembro fundador de la plataforma' },
    { name: 'Code Master', icon: 'Code2', rarity: 'EPIC', description: 'Experto en desarrollo de software' },
    { name: 'Research Pioneer', icon: 'Microscope', rarity: 'EPIC', description: 'Pionero en investigación' },
    { name: 'Community Leader', icon: 'Trophy', rarity: 'LEGENDARY', description: 'Líder de la comunidad SICI' },
    { name: 'Quick Learner', icon: 'Star', rarity: 'COMMON', description: 'Aprendizaje rápido' },
    { name: 'Forum Helper', icon: 'MessageSquare', rarity: 'COMMON', description: 'Ayuda activa en el foro' },
    { name: 'Hackathon Champion', icon: 'Award', rarity: 'LEGENDARY', description: 'Ganador de un hackathon SICI' },
    { name: 'Mentor Estrella', icon: 'GraduationCap', rarity: 'EPIC', description: 'Mentoría destacada' },
    { name: 'Incubator Builder', icon: 'Rocket', rarity: 'RARE', description: 'Constructor activo en la incubadora' },
    { name: 'Publicador Frecuente', icon: 'FileText', rarity: 'RARE', description: 'Múltiples artículos publicados' },
    { name: 'Networker', icon: 'Users', rarity: 'COMMON', description: 'Participación activa en eventos' },
    { name: 'Bug Hunter', icon: 'Bug', rarity: 'EPIC', description: 'Reportó vulnerabilidades reales' },
  ] as const;
  const newBadges = badgeCatalog.filter((b) => !existingBadges.some((e) => e.name === b.name));
  const insertedBadges = newBadges.length ? await db.insert(badges).values(newBadges).returning() : [];
  const allBadges = [...existingBadges, ...insertedBadges];

  const userBadgeValues = Array.from({ length: 25 }, (_, i) => ({
    userId: pool25[i % pool25.length].id,
    badgeId: allBadges[i % allBadges.length].id,
    count: (i % 3) + 1,
  }));
  await db.insert(userBadges).values(userBadgeValues).onConflictDoNothing();

  const existingQuests = await db.query.quests.findMany();
  const questCatalog = [
    { title: 'Primer Proyecto Aprobado', description: 'Consigue que un proyecto sea aprobado por el admin.', category: 'dev', difficulty: 'MEDIUM', pointsReward: 150, triggerType: 'project_approved', triggerThreshold: 1 },
    { title: 'Colaborador del Foro', description: 'Responde 2 preguntas en el foro.', category: 'research', difficulty: 'EASY', pointsReward: 100, triggerType: 'forum_answer_posted', triggerThreshold: 2 },
    { title: 'Voz Activa del Foro', description: 'Responde 5 preguntas en el foro.', category: 'research', difficulty: 'MEDIUM', pointsReward: 250, triggerType: 'forum_answer_posted', triggerThreshold: 5 },
    { title: 'Publicación Científica', description: 'Publica un artículo aprobado.', category: 'research', difficulty: 'HARD', pointsReward: 600, triggerType: 'article_approved', triggerThreshold: 1 },
    { title: 'Investigador Prolífico', description: 'Publica 3 artículos aprobados.', category: 'research', difficulty: 'HARD', pointsReward: 900, triggerType: 'article_approved', triggerThreshold: 3 },
    { title: 'Hackathon Winner', description: 'Ganar primer lugar en un hackathon oficial de SICI.', category: 'dev', difficulty: 'HARD', pointsReward: 700 },
    { title: 'Constructor de la Incubadora', description: 'Formar parte del equipo de un proyecto de incubadora.', category: 'dev', difficulty: 'EASY', pointsReward: 120 },
    { title: 'Mentor Activo', description: 'Abrir una mentoría con temario.', category: 'research', difficulty: 'MEDIUM', pointsReward: 300 },
    { title: 'Estudiante Ejemplar', description: 'Completar un curso interno de la sociedad.', category: 'dev', difficulty: 'EASY', pointsReward: 100 },
    { title: 'Networker SICI', description: 'Confirmar asistencia a 3 eventos.', category: 'dev', difficulty: 'EASY', pointsReward: 90 },
    { title: 'Constructor de Proyectos', description: 'Postular 3 proyectos de investigación.', category: 'dev', difficulty: 'MEDIUM', pointsReward: 350, triggerType: 'project_approved', triggerThreshold: 3 },
    { title: 'Pilar de la Comunidad', description: 'Alcanzar 2000 isipoints acumulados.', category: 'research', difficulty: 'HARD', pointsReward: 500 },
  ] as const;
  const newQuests = questCatalog.filter((q) => !existingQuests.some((e) => e.title === q.title));
  const insertedQuests = newQuests.length ? await db.insert(quests).values(newQuests).returning() : [];
  const allQuests = [...existingQuests, ...insertedQuests];

  const userQuestValues = Array.from({ length: 25 }, (_, i) => {
    const status = pick(['active', 'active', 'completed', 'available'], i);
    return {
      userId: pool25[i % pool25.length].id,
      questId: allQuests[i % allQuests.length].id,
      status,
      progress: status === 'completed' ? 100 : (i * 13) % 100,
      startedAt: status === 'available' ? null : daysAgo(i * 2),
      completedAt: status === 'completed' ? daysAgo(i) : null,
    };
  });
  await db.insert(userQuests).values(userQuestValues);
  console.log(`✅ Badges (${allBadges.length}), quests (${allQuests.length}) y asignaciones`);

  const achievementTitles = [
    'Top Contributor 2026', 'Innovador del Año', 'Primer Proyecto Publicado', 'Mentor Destacado',
    'Ganador CTF Interno', 'Publicación Más Vista', 'Racha de 30 Días Activo', 'Colaborador Estrella',
    'Proyecto Más Votado', 'Fundador de la Incubadora', 'Voluntario del Semestre', 'Excelencia Académica',
    'Líder de Equipo', 'Investigador Emergente', 'Contribuidor Open Source', 'Organizador de Evento',
    'Speaker Invitado', 'Certificación Cloud', 'Certificación en Ciberseguridad', 'Proyecto Interdisciplinario',
    'Mención de Honor', 'Beca de Investigación', 'Reconocimiento del Directorio', 'Embajador SICI',
    'Graduado con Honores',
  ];
  const achievementValues = achievementTitles.map((title, i) => ({
    userId: pool25[i % pool25.length].id,
    title,
    icon: pick(['Trophy', 'Star', 'Award', 'Zap', 'Medal'], i),
    description: `Reconocimiento otorgado por ${title.toLowerCase()} dentro de la comunidad SICI.`,
    achievedAt: daysAgo(i * 10).toISOString().slice(0, 10),
  }));
  await db.insert(achievements).values(achievementValues);
  console.log(`✅ Achievements: ${achievementValues.length}`);

  const ledgerValues = Array.from({ length: 25 }, (_, i) => ({
    userId: pool25[i % pool25.length].id,
    amount: [50, 100, 150, 200, 300][i % 5],
    reason: pick(['Misión completada', 'Proyecto aprobado', 'Participación en evento', 'Respuesta destacada en foro', 'Artículo publicado'], i),
    sourceType: pick(['quest', 'project', 'event', 'forum_answer', 'article'], i),
    awardedBy: adminUser.id,
  }));
  await db.insert(pointsLedger).values(ledgerValues);
  console.log(`✅ Points ledger: ${ledgerValues.length}`);

  // ---------------------------------------------------------------------
  // Organización: unidades reales (pocas, no 25 — no sería creíble) + 25 membresías
  // ---------------------------------------------------------------------
  const existingUnits = await db.query.societyUnits.findMany();
  const unitCatalog = [
    { name: 'Directiva', description: 'Órgano directivo de la sociedad' },
    { name: 'Incubadora', description: 'Incubadora de proyectos de desarrollo' },
    { name: 'Investigación', description: 'Grupo de investigación científica' },
    { name: 'Mentores', description: 'Red de mentores de la sociedad' },
    { name: 'Eventos y Comunidad', description: 'Organización de eventos y vida estudiantil' },
    { name: 'Ciberseguridad', description: 'Área de ciberseguridad ofensiva y defensiva' },
    { name: 'Desarrollo Web3', description: 'Área de blockchain y contratos inteligentes' },
    { name: 'Infraestructura', description: 'Área de infraestructura y DevOps de la plataforma' },
  ] as const;
  const newUnits = unitCatalog.filter((u) => !existingUnits.some((e) => e.name === u.name));
  const insertedUnits = newUnits.length ? await db.insert(societyUnits).values(newUnits).returning() : [];
  const allUnits = [...existingUnits, ...insertedUnits];

  const roleCatalog = ['Presidente', 'Vicepresidente', 'Director', 'Coordinador', 'Investigador Principal', 'Investigador Junior', 'Desarrollador', 'Mentor Senior', 'Miembro Activo'];
  const membershipValues = Array.from({ length: 25 }, (_, i) => ({
    userId: pool25[i % pool25.length].id,
    unitId: allUnits[i % allUnits.length].id,
    role: pick(roleCatalog, i),
    since: daysAgo(200 - i * 5).toISOString().slice(0, 10),
    isActive: i % 8 !== 0,
  }));
  await db.insert(societyMemberships).values(membershipValues);
  console.log(`✅ Unidades (${allUnits.length}) y membresías: ${membershipValues.length}`);

  // ---------------------------------------------------------------------
  // Likes (25) y notificaciones (25)
  // ---------------------------------------------------------------------
  const likeTargets = [
    ...insertedArticles.slice(0, 8).map((a) => ({ targetType: 'article', targetId: a.id })),
    ...insertedProjects.slice(0, 8).map((p) => ({ targetType: 'project', targetId: p.id })),
    ...insertedQuestions.slice(0, 9).map((q) => ({ targetType: 'forum_question', targetId: q.id })),
  ];
  const likeValues = likeTargets.map((t, i) => ({
    userId: pool25[(i + 20) % pool25.length].id,
    targetType: t.targetType,
    targetId: t.targetId,
  }));
  await db.insert(contentLikes).values(likeValues).onConflictDoNothing();
  console.log(`✅ Content likes: ${likeValues.length}`);

  const notificationTemplates = [
    { title: 'Bienvenido a SICI', message: 'Tu cuenta ha sido activada. ¡Explora la plataforma!', type: 'success' },
    { title: 'Proyecto aprobado', message: 'Tu proyecto fue aprobado y ya es público.', type: 'success' },
    { title: 'Nueva respuesta en el foro', message: 'Alguien respondió tu pregunta en el foro.', type: 'info' },
    { title: 'Solicitud de mentoría aceptada', message: 'Tu solicitud de mentoría fue aceptada.', type: 'success' },
    { title: 'Nuevo evento disponible', message: 'Hay un nuevo evento abierto para inscripción.', type: 'info' },
  ];
  const notificationValues = Array.from({ length: 25 }, (_, i) => ({
    userId: pool25[i % pool25.length].id,
    ...pick(notificationTemplates, i),
    isRead: i % 3 === 0,
  }));
  await db.insert(notifications).values(notificationValues);
  console.log(`✅ Notificaciones: ${notificationValues.length}`);

  console.log('🎉 Ingesta masiva de demo completada.');
  await pool.end();
}

main().catch((error) => {
  console.error('❌ Error en la ingesta masiva:', error);
  process.exit(1);
});
