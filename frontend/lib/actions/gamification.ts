'use server';

import { db } from '@/db';
import { achievements, badges, userBadges, quests, userQuests, users, pointsLedger } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';
import { createAchievementSchema, awardPointsSchema, createBadgeSchema, createQuestSchema } from '@/lib/validations/gamification';

// Única forma sancionada de modificar puntos: registra el motivo en points_ledger y
// actualiza el total en la misma transacción (evita lost updates bajo concurrencia).
export async function awardPoints(params: z.infer<typeof awardPointsSchema>) {
  const input = awardPointsSchema.parse(params);

  await db.transaction(async (tx) => {
    await tx.insert(pointsLedger).values(input);
    await tx.update(users).set({ isiPoints: sql`${users.isiPoints} + ${input.amount}` }).where(eq(users.id, input.userId));
  });

  revalidatePath('/dashboard');
  revalidatePath('/ranking');
}

// Achievements
export async function getUserAchievements(userId: string) {
  const userAchievements = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, userId))
    .orderBy(desc(achievements.achievedAt));

  return userAchievements;
}

// Los logros los otorga el sistema/admin, no el propio usuario.
export async function createAchievement(data: z.infer<typeof createAchievementSchema>) {
  await requireAdmin();
  const input = createAchievementSchema.parse(data);

  await db.insert(achievements).values(input);
  revalidatePath('/dashboard');
}

// Badges
export async function getAllBadges() {
  const allBadges = await db.select().from(badges);
  return allBadges;
}

export async function getUserBadges(userId: string) {
  const userBadgesList = await db
    .select({
      id: userBadges.id,
      badgeId: userBadges.badgeId,
      count: userBadges.count,
      unlockedAt: userBadges.unlockedAt,
      badgeName: badges.name,
      badgeIcon: badges.icon,
      badgeRarity: badges.rarity,
    })
    .from(userBadges)
    .leftJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId));

  return userBadgesList;
}

// Las medallas las otorga el sistema/admin, no el propio usuario.
export async function unlockBadge(userId: string, badgeId: string) {
  await requireAdmin();

  await db.insert(userBadges).values({ userId, badgeId });
  revalidatePath('/dashboard');
}

// Medallas acumulables (spec: "Responde a una solicitud de mentoría satisfactoriamente x4").
// Si el usuario ya tiene la medalla, incrementa `count` en vez de duplicar la fila.
export async function unlockOrIncrementBadge(userId: string, badgeName: string) {
  const badge = await db.query.badges.findFirst({ where: eq(badges.name, badgeName) });
  if (!badge) return; // medalla no seedeada todavía — no interrumpe el flujo que la dispara

  await db
    .insert(userBadges)
    .values({ userId, badgeId: badge.id, count: 1 })
    .onConflictDoUpdate({
      target: [userBadges.userId, userBadges.badgeId],
      set: { count: sql`${userBadges.count} + 1` },
    });

  revalidatePath('/dashboard');
}

export async function createBadge(data: z.infer<typeof createBadgeSchema>) {
  await requireAdmin();
  const input = createBadgeSchema.parse(data);

  await db.insert(badges).values(input);
  revalidatePath('/admin/gamification');
}

export async function deleteBadge(id: string) {
  await requireAdmin();
  await db.delete(badges).where(eq(badges.id, id));
  revalidatePath('/admin/gamification');
}

// Quests
export async function getAllQuests() {
  const allQuests = await db
    .select()
    .from(quests)
    .where(eq(quests.isActive, true));

  return allQuests;
}

export async function getAllQuestsForAdmin() {
  await requireAdmin();
  return db.select().from(quests).orderBy(desc(quests.createdAt));
}

export async function createQuest(data: z.infer<typeof createQuestSchema>) {
  await requireAdmin();
  const input = createQuestSchema.parse(data);

  await db.insert(quests).values(input);
  revalidatePath('/admin/gamification');
}

export async function deleteQuest(id: string) {
  await requireAdmin();
  await db.delete(quests).where(eq(quests.id, id));
  revalidatePath('/admin/gamification');
}

export async function getPointsLedger() {
  await requireAdmin();
  return db
    .select({
      id: pointsLedger.id,
      userId: pointsLedger.userId,
      userName: users.name,
      amount: pointsLedger.amount,
      reason: pointsLedger.reason,
      sourceType: pointsLedger.sourceType,
      createdAt: pointsLedger.createdAt,
    })
    .from(pointsLedger)
    .leftJoin(users, eq(pointsLedger.userId, users.id))
    .orderBy(desc(pointsLedger.createdAt))
    .limit(100);
}

export async function getUserQuests(userId: string) {
  const userQuestsList = await db
    .select({
      id: userQuests.id,
      status: userQuests.status,
      progress: userQuests.progress,
      startedAt: userQuests.startedAt,
      completedAt: userQuests.completedAt,
      questId: userQuests.questId,
      questTitle: quests.title,
      questDescription: quests.description,
      questCategory: quests.category,
      questDifficulty: quests.difficulty,
      questPointsReward: quests.pointsReward,
    })
    .from(userQuests)
    .leftJoin(quests, eq(userQuests.questId, quests.id))
    .where(eq(userQuests.userId, userId));

  return userQuestsList;
}

// Las misiones están siempre activas y su progreso avanza solo (ver lib/quest-engine.ts,
// invocado desde las actions que disparan cada triggerType) — no hay "aceptar misión" manual.

// User scores
export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user;
}

// Ranking
export async function getRankingUsers() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
      role: users.role,
      isiPoints: users.isiPoints,
    })
    .from(users)
    .orderBy(desc(users.isiPoints));

  return allUsers;
}
