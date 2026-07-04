import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { forumQuestions, forumAnswers, courses, mentors, users } from './schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema: { users, mentors } });

  console.log('🌱 Iniciando seed de forum y cursos...');

  const adminUser = await db.query.users.findFirst({
    where: eq(users.email, 'admin@sici.edu.pe'),
  });

  const studentUser = await db.query.users.findFirst({
    where: eq(users.email, 'student@sici.edu.pe'),
  });

  const adminMentor = await db.query.mentors.findFirst({
    where: eq(mentors.userId, adminUser!.id),
  });

  if (!adminUser || !studentUser || !adminMentor) {
    console.error('❌ Usuarios o mentores no encontrados. Ejecuta db:seed y db:seed:incubator primero.');
    process.exit(1);
  }

  // Forum Questions
  const [q1] = await db.insert(forumQuestions).values([
    {
      title: '¿Cómo implementar WebSockets en Next.js 15?',
      description: 'Estoy teniendo problemas con la integración de Socket.io en las nuevas rutas de App Router. ¿Alguien tiene un ejemplo funcional?',
      tags: ['Next.js', 'WebSockets', 'React'],
      authorId: studentUser.id,
      views: 450,
      likes: 12,
    },
  ]).returning();

  const [q2] = await db.insert(forumQuestions).values([
    {
      title: 'Error de CORS al conectar con API de Laravel',
      description: 'He configurado el middleware de CORS en Laravel pero sigo recibiendo errores al intentar hacer peticiones desde mi frontend en Next.js.',
      tags: ['Laravel', 'CORS', 'API'],
      authorId: studentUser.id,
      views: 230,
      likes: 5,
    },
  ]).returning();

  const [q3] = await db.insert(forumQuestions).values([
    {
      title: 'Mejores prácticas para seguridad en Smart Contracts',
      description: '¿Cuáles son los ataques más comunes que debo prevenir al escribir contratos en Solidity? He oído hablar de reentrancy.',
      tags: ['Solidity', 'Blockchain', 'Security'],
      authorId: adminUser.id,
      views: 890,
      likes: 24,
    },
  ]).returning();

  console.log('✅ Forum questions creadas');

  // Forum Answers
  await db.insert(forumAnswers).values([
    {
      questionId: q1.id,
      content: 'Para Next.js 15, te recomiendo usar un servidor Express personalizado o una ruta de API específica. El App Router no soporta WebSockets directamente.',
      authorId: adminUser.id,
      likes: 8,
    },
    {
      questionId: q3.id,
      content: 'El ataque de reentrancy es clásico. Usa el patrón Checks-Effects-Interactions para prevenirlo. También considera usar OpenZeppelin ReentrancyGuard.',
      authorId: adminUser.id,
      likes: 15,
    },
  ]);

  console.log('✅ Forum answers creadas');

  // Courses
  await db.insert(courses).values([
    {
      name: 'Fundamentos de Deep Learning',
      description: 'Aprende las bases de las redes neuronales y cómo implementarlas desde cero.',
      duration: '40 horas',
      instructorId: adminMentor.id,
      syllabus: [
        { title: 'Introducción a las Redes Neuronales', lessons: ['Conceptos básicos', 'Perceptrón', 'Backpropagation'] },
        { title: 'Funciones de Activación y Optimización', lessons: ['ReLU, Sigmoid, Tanh', 'Gradiente Descendente', 'Adam Optimizer'] },
        { title: 'Redes Neuronales Convolucionales (CNN)', lessons: ['Capas de Convolución', 'Pooling', 'Arquitecturas famosas'] },
      ],
      category: 'Inteligencia Artificial',
      status: 'active',
      image: 'https://picsum.photos/seed/course1/800/450',
      objective: 'Aprender las bases de las redes neuronales y cómo implementarlas desde cero.',
      results: 'Capacidad para diseñar y entrenar modelos de Deep Learning para visión artificial.',
      relevantInfo: 'Incluye certificación oficial de la SICI y acceso a laboratorios de GPU.',
    },
    {
      name: 'Hacking Ético y Seguridad Ofensiva',
      description: 'Domina las técnicas de penetración y protege infraestructuras críticas.',
      duration: '35 horas',
      instructorId: adminMentor.id,
      syllabus: [
        { title: 'Fases del Pentesting', lessons: ['Reconocimiento', 'Escaneo', 'Ganar acceso'] },
        { title: 'Explotación de Sistemas', lessons: ['Metasploit', 'Payloads', 'Post-explotación'] },
      ],
      category: 'Ciberseguridad',
      status: 'finished',
      image: 'https://picsum.photos/seed/course2/800/450',
      gallery: [
        'https://picsum.photos/seed/course2_1/800/600',
        'https://picsum.photos/seed/course2_2/800/600',
        'https://picsum.photos/seed/course2_3/800/600',
        'https://picsum.photos/seed/course2_4/800/600'
      ],
      objective: 'Dominar técnicas de penetración ética.',
      results: 'Habilidad para realizar auditorías de seguridad ofensiva.',
      relevantInfo: 'Laboratorios prácticos en entornos controlados de simulación de ataques.',
    },
    {
      name: 'Desarrollo de Aplicaciones con Next.js 15',
      description: 'Construye aplicaciones web modernas, rápidas y escalables con el App Router.',
      duration: '30 horas',
      instructorId: adminMentor.id,
      syllabus: [
        { title: 'Fundamentos de React y Next.js', lessons: ['App Router', 'Server Components', 'Client Components'] },
        { title: 'Data Fetching', lessons: ['Server Actions', 'Suspense', 'Streaming'] },
      ],
      category: 'Desarrollo Web',
      status: 'active',
      image: 'https://picsum.photos/seed/course3/800/450',
      objective: 'Construir aplicaciones web modernas y escalables.',
      results: 'Desarrollo de una aplicación fullstack con Next.js 15.',
      relevantInfo: 'Enfoque 100% práctico basado en proyectos reales del mundo laboral.',
    },
  ]);

  console.log('✅ Courses creados');
  console.log('✅ Seed de forum y cursos completado');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Error en seed:', error);
  process.exit(1);
});
