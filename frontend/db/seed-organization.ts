import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { societyUnits, societyMemberships, notifications, users } from './schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema: { users } });

  console.log('🌱 Iniciando seed de organización...');

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

  // Society Units
  const [u1, u2, u3, u4] = await db.insert(societyUnits).values([
    { name: 'Directiva', description: 'Órgano directivo de la sociedad' },
    { name: 'Incubadora', description: 'Incubadora de proyectos de desarrollo' },
    { name: 'Investigación', description: 'Grupo de investigación científica' },
    { name: 'Mentores', description: 'Red de mentores de la sociedad' },
  ]).returning();

  console.log('✅ Society units creadas');

  // Society Memberships
  await db.insert(societyMemberships).values([
    { userId: adminUser.id, unitId: u1.id, role: 'Presidente', since: '2024-01-01' },
    { userId: adminUser.id, unitId: u2.id, role: 'Director', since: '2024-01-01' },
    { userId: adminUser.id, unitId: u3.id, role: 'Investigador Principal', since: '2024-01-01' },
    { userId: adminUser.id, unitId: u4.id, role: 'Mentor Senior', since: '2024-01-01' },
    { userId: studentUser.id, unitId: u2.id, role: 'Desarrollador', since: '2024-03-01' },
    { userId: studentUser.id, unitId: u3.id, role: 'Investigador Junior', since: '2024-03-01' },
  ]);

  console.log('✅ Society memberships creadas');

  // Notifications
  await db.insert(notifications).values([
    {
      userId: adminUser.id,
      title: 'Bienvenido al sistema',
      message: 'Tu cuenta de administrador ha sido creada exitosamente.',
      type: 'success',
    },
    {
      userId: adminUser.id,
      title: 'Nuevo proyecto creado',
      message: 'El proyecto "Optimización de Algoritmos" ha sido publicado.',
      type: 'info',
    },
    {
      userId: studentUser.id,
      title: 'Bienvenido a SICI',
      message: 'Tu cuenta ha sido activada. ¡Explora la plataforma!',
      type: 'success',
    },
  ]);

  console.log('✅ Notifications creadas');
  console.log('✅ Seed de organización completado');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Error en seed:', error);
  process.exit(1);
});
