import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { incubatorProjects, incubatorTeamMembers, mentors, mentorshipRequests, users } from './schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema: { users } });

  console.log('🌱 Iniciando seed de incubadora y mentorías...');

  const adminUser = await db.query.users.findFirst({
    where: eq(users.email, 'admin@sici.edu.pe'),
  });

  const studentUser = await db.query.users.findFirst({
    where: eq(users.email, 'student@sici.edu.pe'),
  });

  if (!adminUser || !studentUser) {
    console.error('❌ Usuarios no encontrados. Ejecuta db:seed primero.');
    process.exit(1);
  }

  // Incubator Projects
  const insertedProjects = await db.insert(incubatorProjects).values([
    {
      title: 'EcoTrack IoT',
      authorId: adminUser.id,
      status: 'En Desarrollo',
      approvalStatus: 'approved',
      description: 'Sistema de monitoreo ambiental en tiempo real para campus universitarios utilizando sensores de bajo costo y red LoRaWAN.',
      content: '# EcoTrack IoT\n\nEste proyecto busca democratizar el acceso a datos ambientales precisos en entornos universitarios.',
      categories: ['IoT', 'Sostenibilidad', 'Smart City'],
      client: 'Dirección de Infraestructura Universitaria',
      image: 'https://picsum.photos/seed/ecotrack/1200/800',
      technologies: ['Arduino', 'LoRaWAN', 'React Native', 'Node.js'],
    },
    {
      title: 'EduChain',
      authorId: adminUser.id,
      status: 'MVP',
      approvalStatus: 'approved',
      description: 'Plataforma descentralizada para la emisión y verificación de certificados académicos inmutables.',
      content: '# EduChain\n\nEduChain utiliza la tecnología blockchain para eliminar el fraude en los certificados académicos.',
      categories: ['Blockchain', 'EdTech', 'Web3'],
      client: 'Secretaría Académica Regional',
      image: 'https://picsum.photos/seed/educhain/1200/800',
      technologies: ['Solidity', 'Ethereum', 'Next.js', 'Ethers.js'],
    },
    {
      title: 'Blockchain Credentials',
      authorId: adminUser.id,
      status: 'Planificación',
      approvalStatus: 'approved',
      description: 'Sistema de certificación digital basado en tecnología blockchain para garantizar la autenticidad e inmutabilidad de los diplomas.',
      content: '# Blockchain Credentials\n\nUn sistema robusto para la gestión de credenciales digitales.',
      categories: ['Blockchain', 'Security', 'Web3'],
      client: 'Secretaría General',
      image: 'https://picsum.photos/seed/blockchain/1200/800',
      technologies: ['Solidity', 'Ethereum', 'React', 'IPFS'],
    },
  ]).returning();

  console.log('✅ Incubator projects creados');

  await db.insert(incubatorTeamMembers).values(
    insertedProjects.map((p) => ({ incubatorProjectId: p.id, userId: adminUser.id, role: 'admin' as const }))
  );

  console.log('✅ Incubator team members creados');

  // Mentors
  await db.insert(mentors).values([
    {
      userId: adminUser.id,
      specialty: 'Machine Learning & Data Science',
      experience: '15 años en investigación académica y consultoría industrial.',
      mentorType: 'docente',
      skills: [
        { name: 'Deep Learning', level: 95 },
        { name: 'Python', level: 90 },
        { name: 'Data Science', level: 88 },
      ],
      isActive: true,
    },
    {
      userId: studentUser.id,
      specialty: 'Fullstack Development & AI',
      experience: 'Estudiante destacado, ganador de múltiples hackathons.',
      mentorType: 'estudiante',
      skills: [
        { name: 'React/Next.js', level: 98 },
        { name: 'Node.js', level: 90 },
        { name: 'AI Integration', level: 85 },
      ],
      isActive: true,
    },
  ]);

  console.log('✅ Mentors creados');

  // Mentorship Requests
  await db.insert(mentorshipRequests).values([
    {
      studentId: studentUser.id,
      topic: 'Optimización de Algoritmos en Rust',
      description: 'Necesito ayuda para mejorar el rendimiento de un motor de búsqueda que estoy desarrollando.',
      tags: ['Rust', 'Algoritmos', 'Backend'],
      status: 'pending',
    },
    {
      studentId: studentUser.id,
      topic: 'Implementación de Smart Contracts en Ethereum',
      description: 'Buscando mentor para revisar la seguridad de un contrato de votación descentralizada.',
      tags: ['Blockchain', 'Solidity', 'Ethereum'],
      status: 'accepted',
    },
  ]);

  console.log('✅ Mentorship requests creados');
  console.log('✅ Seed de incubadora y mentorías completado');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Error en seed:', error);
  process.exit(1);
});
