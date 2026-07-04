/**
 * Verificación Fase 1: filtro de aprobación + cupos de apoyo bajo concurrencia.
 *
 * Igual que verify-phase0.ts, no se puede invocar directamente las server actions gateadas
 * (requireAuth/requireAdmin dependen del contexto de request de Next.js). Este script ejercita
 * el mismo patrón (SELECT ... FOR UPDATE dentro de una transacción) que usa
 * respondToSupportRequest en lib/actions/projects.ts para verificar que los cupos de apoyo no
 * se puedan vender de más bajo aprobaciones concurrentes.
 *
 * Uso: pnpm verify:phase1
 */
import 'dotenv/config';
import { db } from '../db';
import { users, projects, articles, projectSupportRequests } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`OK: ${msg}`);
}

async function approveSupportRequest(projectId: string, requestId: string, supportSlots: number) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT id FROM ${projects} WHERE id = ${projectId} FOR UPDATE`);
    const approvedCount = await tx
      .select({ id: projectSupportRequests.id })
      .from(projectSupportRequests)
      .where(and(eq(projectSupportRequests.projectId, projectId), eq(projectSupportRequests.status, 'approved')));
    if (approvedCount.length >= supportSlots) {
      throw new Error('no_slots');
    }
    await tx.update(projectSupportRequests).set({ status: 'approved', respondedAt: new Date() }).where(eq(projectSupportRequests.id, requestId));
  });
}

async function main() {
  const SLOTS = 3;
  const REQUESTS = 8;

  const [project] = await db.insert(projects).values({ title: '__verify_phase1__', description: 'temp', status: 'pending', supportSlots: SLOTS }).returning();
  const [approvedProject] = await db.insert(projects).values({ title: '__verify_phase1_approved__', description: 'temp', status: 'approved' }).returning();
  const [article] = await db.insert(articles).values({ title: '__verify_phase1_article__', abstract: 'temp', status: 'pending' }).returning();

  const testUsers = await db
    .insert(users)
    .values(Array.from({ length: REQUESTS }, (_, i) => ({ email: `__verify_phase1_${i}@test.local`, name: `Verify ${i}`, passwordHash: 'x' })))
    .returning();

  const requests = await db
    .insert(projectSupportRequests)
    .values(testUsers.map((u) => ({ projectId: project.id, userId: u.id, status: 'pending' })))
    .returning();

  try {
    // --- A) Filtro de aprobación en listados públicos ---
    const publicProjects = await db.select().from(projects).where(eq(projects.status, 'approved'));
    assert(publicProjects.some((p) => p.id === approvedProject.id), 'proyecto approved aparece en listado público');
    assert(!publicProjects.some((p) => p.id === project.id), 'proyecto pending NO aparece en listado público');

    const publicArticles = await db.select().from(articles).where(eq(articles.status, 'approved'));
    assert(!publicArticles.some((a) => a.id === article.id), 'artículo pending NO aparece en listado público');

    // --- B) Cupos de apoyo bajo aprobaciones concurrentes ---
    const results = await Promise.allSettled(requests.map((r) => approveSupportRequest(project.id, r.id, SLOTS)));
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    assert(succeeded === SLOTS, `solicitudes aprobadas = ${succeeded}, esperado ${SLOTS} (cupos no vendidos de más)`);

    const [{ value: approvedInDb }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(projectSupportRequests)
      .where(and(eq(projectSupportRequests.projectId, project.id), eq(projectSupportRequests.status, 'approved')));
    assert(Number(approvedInDb) === SLOTS, `filas aprobadas en DB = ${approvedInDb}, esperado ${SLOTS}`);

    console.log('\nFase 1: filtro de aprobación y cupos de apoyo verificados.');
  } finally {
    await db.delete(projectSupportRequests).where(eq(projectSupportRequests.projectId, project.id));
    await db.delete(articles).where(eq(articles.id, article.id));
    await db.delete(projects).where(eq(projects.id, project.id));
    await db.delete(projects).where(eq(projects.id, approvedProject.id));
    for (const u of testUsers) {
      await db.delete(users).where(eq(users.id, u.id));
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
