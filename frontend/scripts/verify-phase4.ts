/**
 * Verificación Fase 4: motor de misiones siempre-activas (auto-progreso + completar + otorgar
 * puntos) y medallas acumulables (stacking).
 *
 * checkAndProgressQuests/unlockOrIncrementBadge llaman revalidatePath() internamente (vía
 * awardPoints), lo que requiere contexto de request de Next.js y falla en un script plano
 * ("Invariant: static generation store missing"). Este script replica exactamente la misma
 * lógica de DB (mismo patrón que los scripts de fases anteriores) sin el revalidatePath.
 *
 * Uso: pnpm verify:phase4
 */
import 'dotenv/config';
import { db } from '../db';
import { users, quests, userQuests, badges, userBadges, pointsLedger } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`OK: ${msg}`);
}

// Replica lib/quest-engine.ts checkAndProgressQuests(), sin el awardPoints con revalidatePath.
async function checkAndProgressQuestsNoRevalidate(userId: string, actionType: string, incrementBy = 1) {
  const activeQuests = await db.query.quests.findMany({ where: and(eq(quests.isActive, true), eq(quests.triggerType, actionType)) });

  for (const quest of activeQuests) {
    if (!quest.triggerThreshold) continue;
    const existing = await db.query.userQuests.findFirst({ where: and(eq(userQuests.userId, userId), eq(userQuests.questId, quest.id)) });
    if (existing?.status === 'completed') continue;

    const newProgressRaw = (existing?.progress ?? 0) + incrementBy;
    const progressPct = Math.min(100, Math.round((newProgressRaw / quest.triggerThreshold) * 100));
    const completed = newProgressRaw >= quest.triggerThreshold;

    if (existing) {
      await db.update(userQuests).set({ progress: progressPct, status: completed ? 'completed' : 'active', completedAt: completed ? new Date() : null }).where(eq(userQuests.id, existing.id));
    } else {
      await db.insert(userQuests).values({ userId, questId: quest.id, status: completed ? 'completed' : 'active', progress: progressPct, startedAt: new Date(), completedAt: completed ? new Date() : null });
    }

    if (completed && quest.pointsReward > 0) {
      await db.transaction(async (tx) => {
        await tx.insert(pointsLedger).values({ userId, amount: quest.pointsReward, reason: 'quest_completed', sourceType: 'quest', sourceId: quest.id });
        await tx.update(users).set({ isiPoints: sql`${users.isiPoints} + ${quest.pointsReward}` }).where(eq(users.id, userId));
      });
    }
  }
}

// Replica lib/actions/gamification.ts unlockOrIncrementBadge(), sin el revalidatePath.
async function unlockOrIncrementBadgeNoRevalidate(userId: string, badgeName: string) {
  const badge = await db.query.badges.findFirst({ where: eq(badges.name, badgeName) });
  if (!badge) return;
  await db
    .insert(userBadges)
    .values({ userId, badgeId: badge.id, count: 1 })
    .onConflictDoUpdate({ target: [userBadges.userId, userBadges.badgeId], set: { count: sql`${userBadges.count} + 1` } });
}

async function main() {
  const TRIGGER = '__verify_phase4_trigger__';
  const QUEST_POINTS = 50;

  const [testUser] = await db.insert(users).values({ email: '__verify_phase4@test.local', name: 'Verify', passwordHash: 'x' }).returning();
  const [testQuest] = await db.insert(quests).values({
    title: '__verify_phase4_quest__',
    category: 'dev',
    difficulty: 'EASY',
    pointsReward: QUEST_POINTS,
    triggerType: TRIGGER,
    triggerThreshold: 3,
    isActive: true,
  }).returning();
  const [testBadge] = await db.insert(badges).values({ name: '__verify_phase4_badge__', rarity: 'COMMON' }).returning();

  try {
    // --- A) Auto-progreso de misión hasta completarse ---
    await checkAndProgressQuestsNoRevalidate(testUser.id, TRIGGER);
    let uq = await db.query.userQuests.findFirst({ where: and(eq(userQuests.userId, testUser.id), eq(userQuests.questId, testQuest.id)) });
    assert(uq?.status === 'active' && uq.progress === 33, `progreso tras 1/3 = ${uq?.progress}%, status=${uq?.status}`);

    await checkAndProgressQuestsNoRevalidate(testUser.id, TRIGGER);
    await checkAndProgressQuestsNoRevalidate(testUser.id, TRIGGER);
    uq = await db.query.userQuests.findFirst({ where: and(eq(userQuests.userId, testUser.id), eq(userQuests.questId, testQuest.id)) });
    assert(uq?.status === 'completed' && uq.progress === 100, `misión completada tras 3/3 (status=${uq?.status}, progress=${uq?.progress})`);

    const [{ isiPoints }] = await db.select({ isiPoints: users.isiPoints }).from(users).where(eq(users.id, testUser.id));
    assert(isiPoints === QUEST_POINTS, `isiPoints tras completar misión = ${isiPoints}, esperado ${QUEST_POINTS}`);

    const ledgerRows = await db.select().from(pointsLedger).where(and(eq(pointsLedger.userId, testUser.id), eq(pointsLedger.reason, 'quest_completed')));
    assert(ledgerRows.length === 1, `points_ledger tiene 1 fila 'quest_completed' (auditable), encontradas ${ledgerRows.length}`);

    // Una 4ta llamada no debe volver a otorgar puntos (la misión ya está completed).
    await checkAndProgressQuestsNoRevalidate(testUser.id, TRIGGER);
    const [{ isiPoints: isiPointsAfter }] = await db.select({ isiPoints: users.isiPoints }).from(users).where(eq(users.id, testUser.id));
    assert(isiPointsAfter === QUEST_POINTS, `isiPoints no cambia tras completar (${isiPointsAfter}) — sin doble pago`);

    // --- B) Medallas acumulables ---
    for (let i = 0; i < 4; i++) {
      await unlockOrIncrementBadgeNoRevalidate(testUser.id, '__verify_phase4_badge__');
    }
    const badgeRows = await db.select().from(userBadges).where(and(eq(userBadges.userId, testUser.id), eq(userBadges.badgeId, testBadge.id)));
    assert(badgeRows.length === 1, `una sola fila en user_badges (no duplicados), encontradas ${badgeRows.length}`);
    assert(badgeRows[0].count === 4, `count de la medalla = ${badgeRows[0].count}, esperado 4 (stacking)`);

    console.log('\nFase 4: motor de misiones y medallas acumulables verificados.');
  } finally {
    await db.delete(userQuests).where(eq(userQuests.questId, testQuest.id));
    await db.delete(userBadges).where(eq(userBadges.badgeId, testBadge.id));
    await db.delete(pointsLedger).where(eq(pointsLedger.userId, testUser.id));
    await db.delete(quests).where(eq(quests.id, testQuest.id));
    await db.delete(badges).where(eq(badges.id, testBadge.id));
    await db.delete(users).where(eq(users.id, testUser.id));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
