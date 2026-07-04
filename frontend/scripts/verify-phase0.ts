/**
 * Verificación Fase 0: prueba de concurrencia contra Postgres real.
 *
 * Las server actions (toggleLike, awardPoints) están gateadas con requireAuth(), que depende
 * del contexto de request de Next.js (next/headers) y no puede invocarse desde un script plano.
 * Este script ejercita el mismo patrón de incremento atómico (`db.transaction` + `sql\`col + n\``)
 * que usan lib/actions/likes.ts y lib/actions/gamification.ts, para verificar empíricamente que
 * no hay lost updates bajo concurrencia — que es la parte que de verdad necesita evidencia (los
 * guards de auth son condicionales simples, verificados por inspección + typecheck).
 *
 * Uso: pnpm verify:phase0
 */
import 'dotenv/config';
import { db } from '../db';
import { users, projects, contentLikes, pointsLedger } from '../db/schema';
import { eq, sql, count } from 'drizzle-orm';

const N = 30;

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`OK: ${msg}`);
}

async function main() {
  // Setup: proyecto de prueba + N usuarios de prueba
  const [project] = await db
    .insert(projects)
    .values({ title: '__verify_phase0__', description: 'temp', likes: 0 })
    .returning();

  const testUsers = await db
    .insert(users)
    .values(
      Array.from({ length: N }, (_, i) => ({
        email: `__verify_phase0_${i}@test.local`,
        name: `Verify ${i}`,
        passwordHash: 'x',
      }))
    )
    .returning();

  try {
    // --- A) Incremento atómico de likes bajo concurrencia ---
    await Promise.all(
      testUsers.map((u) =>
        db.transaction(async (tx) => {
          await tx.insert(contentLikes).values({ userId: u.id, targetType: 'project', targetId: project.id });
          await tx.update(projects).set({ likes: sql`${projects.likes} + 1` }).where(eq(projects.id, project.id));
        })
      )
    );

    const [{ likes: finalLikes }] = await db.select({ likes: projects.likes }).from(projects).where(eq(projects.id, project.id));
    assert(finalLikes === N, `likes final = ${finalLikes}, esperado ${N} (sin lost updates)`);

    const [{ value: likeRows }] = await db.select({ value: count() }).from(contentLikes).where(eq(contentLikes.targetId, project.id));
    assert(Number(likeRows) === N, `content_likes filas = ${likeRows}, esperado ${N}`);

    // --- B) awardPoints atómico + ledger auditable bajo concurrencia ---
    const target = testUsers[0];
    await Promise.all(
      testUsers.map(() =>
        db.transaction(async (tx) => {
          await tx.insert(pointsLedger).values({ userId: target.id, amount: 10, reason: 'verify_phase0' });
          await tx.update(users).set({ isiPoints: sql`${users.isiPoints} + 10` }).where(eq(users.id, target.id));
        })
      )
    );

    const [{ isiPoints }] = await db.select({ isiPoints: users.isiPoints }).from(users).where(eq(users.id, target.id));
    assert(isiPoints === N * 10, `isiPoints final = ${isiPoints}, esperado ${N * 10} (sin lost updates)`);

    const [{ value: ledgerRows }] = await db.select({ value: count() }).from(pointsLedger).where(eq(pointsLedger.userId, target.id));
    assert(Number(ledgerRows) === N, `points_ledger filas = ${ledgerRows}, esperado ${N} (auditable)`);

    console.log('\nFase 0: concurrencia verificada sin lost updates.');
  } finally {
    // Cleanup
    await db.delete(contentLikes).where(eq(contentLikes.targetId, project.id));
    await db.delete(pointsLedger).where(eq(pointsLedger.reason, 'verify_phase0'));
    await db.delete(projects).where(eq(projects.id, project.id));
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
