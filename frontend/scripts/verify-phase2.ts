/**
 * Verificación Fase 2: filtros de aprobación (incubadora/mentoría) + creación concurrente
 * de categorías de mentoría sin duplicados.
 *
 * Uso: pnpm verify:phase2
 */
import 'dotenv/config';
import { db } from '../db';
import { users, incubatorProjects, mentorshipRequests, mentorshipCategories } from '../db/schema';
import { eq } from 'drizzle-orm';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`OK: ${msg}`);
}

// Replica la lógica de findOrCreateCategory() en lib/actions/mentorship.ts (no exportada).
async function findOrCreateCategory(name: string) {
  const existing = await db.query.mentorshipCategories.findFirst({ where: eq(mentorshipCategories.name, name) });
  if (existing) return existing;
  const [created] = await db.insert(mentorshipCategories).values({ name }).onConflictDoNothing().returning();
  if (created) return created;
  const race = await db.query.mentorshipCategories.findFirst({ where: eq(mentorshipCategories.name, name) });
  if (!race) throw new Error('No se pudo crear la categoría');
  return race;
}

async function main() {
  const CATEGORY_NAME = '__verify_phase2_category__';

  const [pendingIncubator] = await db.insert(incubatorProjects).values({ title: '__vp2_incubator__', description: 'temp', approvalStatus: 'pending' }).returning();
  const [approvedIncubator] = await db.insert(incubatorProjects).values({ title: '__vp2_incubator_approved__', description: 'temp', approvalStatus: 'approved' }).returning();

  const [testUser] = await db.insert(users).values({ email: '__verify_phase2@test.local', name: 'Verify', passwordHash: 'x' }).returning();
  const [pendingMentorship] = await db.insert(mentorshipRequests).values({ topic: '__vp2_mentorship__', description: 'temp', studentId: testUser.id, approvalStatus: 'pending' }).returning();
  const [approvedMentorship] = await db.insert(mentorshipRequests).values({ topic: '__vp2_mentorship_approved__', description: 'temp', studentId: testUser.id, approvalStatus: 'approved' }).returning();

  try {
    const publicIncubator = await db.select().from(incubatorProjects).where(eq(incubatorProjects.approvalStatus, 'approved'));
    assert(publicIncubator.some((p) => p.id === approvedIncubator.id), 'proyecto de incubadora approved aparece en listado público');
    assert(!publicIncubator.some((p) => p.id === pendingIncubator.id), 'proyecto de incubadora pending NO aparece en listado público');

    const publicMentorship = await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.approvalStatus, 'approved'));
    assert(publicMentorship.some((m) => m.id === approvedMentorship.id), 'mentoría approved aparece en listado público');
    assert(!publicMentorship.some((m) => m.id === pendingMentorship.id), 'mentoría pending NO aparece en listado público');

    // 15 llamadas concurrentes creando la MISMA categoría nueva → debe quedar exactamente 1 fila.
    await Promise.all(Array.from({ length: 15 }, () => findOrCreateCategory(CATEGORY_NAME)));
    const categoryRows = await db.select().from(mentorshipCategories).where(eq(mentorshipCategories.name, CATEGORY_NAME));
    assert(categoryRows.length === 1, `categorías creadas para "${CATEGORY_NAME}" = ${categoryRows.length}, esperado 1 (sin duplicados)`);

    console.log('\nFase 2: filtros de aprobación y creación concurrente de categorías verificados.');
  } finally {
    await db.delete(mentorshipRequests).where(eq(mentorshipRequests.id, pendingMentorship.id));
    await db.delete(mentorshipRequests).where(eq(mentorshipRequests.id, approvedMentorship.id));
    await db.delete(users).where(eq(users.id, testUser.id));
    await db.delete(incubatorProjects).where(eq(incubatorProjects.id, pendingIncubator.id));
    await db.delete(incubatorProjects).where(eq(incubatorProjects.id, approvedIncubator.id));
    await db.delete(mentorshipCategories).where(eq(mentorshipCategories.name, CATEGORY_NAME));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
