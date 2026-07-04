import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { badges, userBadges, quests, userQuests, achievements, users } from './schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema: { users } });

  console.log('🌱 Iniciando seed de gamificación...');

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

  // Badges
  const [b1, b2, b3, b4, b5] = await db.insert(badges).values([
    { name: 'Early Adopter', icon: 'Zap', rarity: 'RARE', description: 'Miembro fundador de la plataforma' },
    { name: 'Code Master', icon: 'Code2', rarity: 'EPIC', description: 'Experto en desarrollo de software' },
    { name: 'Research Pioneer', icon: 'Microscope', rarity: 'EPIC', description: 'Pionero en investigación' },
    { name: 'Community Leader', icon: 'Trophy', rarity: 'LEGENDARY', description: 'Líder de la comunidad SICI' },
    { name: 'Quick Learner', icon: 'Star', rarity: 'COMMON', description: 'Aprendizaje rápido' },
  ]).returning();

  console.log('✅ Badges creados');

  // User Badges
  await db.insert(userBadges).values([
    { userId: adminUser.id, badgeId: b1.id },
    { userId: adminUser.id, badgeId: b2.id },
    { userId: adminUser.id, badgeId: b4.id },
    { userId: studentUser.id, badgeId: b1.id },
    { userId: studentUser.id, badgeId: b5.id },
  ]);

  console.log('✅ User badges asignados');

  // Quests
  const [q1, q2, q3, q4] = await db.insert(quests).values([
    {
      title: 'Primer Proyecto Aprobado',
      description: 'Consigue que un proyecto de investigación sea aprobado por el admin.',
      category: 'dev',
      difficulty: 'MEDIUM',
      pointsReward: 150,
      triggerType: 'project_approved',
      triggerThreshold: 1,
    },
    {
      title: 'Colaborador del Foro',
      description: 'Responde 2 preguntas en el foro.',
      category: 'research',
      difficulty: 'EASY',
      pointsReward: 100,
      triggerType: 'forum_answer_posted',
      triggerThreshold: 2,
    },
    {
      title: 'Hackathon Winner',
      description: 'Ganar primer lugar en hackathon oficial de SICI.',
      category: 'dev',
      difficulty: 'HARD',
      pointsReward: 700,
    },
    {
      title: 'Publicación Científica',
      description: 'Publica un artículo aprobado en el repositorio SICI.',
      category: 'research',
      difficulty: 'HARD',
      pointsReward: 600,
      triggerType: 'article_approved',
      triggerThreshold: 1,
    },
  ]).returning();

  console.log('✅ Quests creados');

  // User Quests
  await db.insert(userQuests).values([
    {
      userId: adminUser.id,
      questId: q1.id,
      status: 'active',
      progress: 65,
      startedAt: new Date(),
    },
    {
      userId: adminUser.id,
      questId: q2.id,
      status: 'completed',
      progress: 100,
      startedAt: new Date('2024-01-01'),
      completedAt: new Date('2024-01-15'),
    },
    {
      userId: studentUser.id,
      questId: q1.id,
      status: 'active',
      progress: 30,
      startedAt: new Date(),
    },
  ]);

  console.log('✅ User quests asignados');

  // Achievements
  await db.insert(achievements).values([
    {
      userId: adminUser.id,
      title: 'Top Contributor 2023',
      icon: 'Trophy',
      description: 'Reconocimiento por mayor cantidad de aportes al repositorio central.',
      achievedAt: '2023-12-15',
    },
    {
      userId: adminUser.id,
      title: 'Innovador del Año',
      icon: 'Zap',
      description: 'Premio a la mejor solución técnica en la Hackathon SICI.',
      achievedAt: '2023-11-20',
    },
    {
      userId: studentUser.id,
      title: 'Primer Proyecto Publicado',
      icon: 'Star',
      description: 'Publicaste tu primer proyecto en la plataforma.',
      achievedAt: '2024-01-10',
    },
  ]);

  console.log('✅ Achievements creados');

  // Update user scores
  await db.update(users)
    .set({ isiPoints: 4000 })
    .where(eq(users.id, adminUser.id));

  await db.update(users)
    .set({ isiPoints: 2300 })
    .where(eq(users.id, studentUser.id));

  console.log('✅ User scores actualizados');
  console.log('✅ Seed de gamificación completado');

  await pool.end();
}

seed().catch((error) => {
  console.error('❌ Error en seed:', error);
  process.exit(1);
});
