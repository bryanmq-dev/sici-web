import { db } from '@/db';
import { quests, userQuests } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { awardPoints } from '@/lib/actions/gamification';

// Misiones siempre activas: no hay "aceptar misión" manual. Se invoca desde cualquier action
// cuyo evento coincida con el triggerType de una quest activa (ver seed-gamification.ts para
// los triggerType existentes, ej. 'forum_answer_posted', 'project_approved').
export async function checkAndProgressQuests(userId: string, actionType: string, incrementBy = 1) {
  const activeQuests = await db.query.quests.findMany({
    where: and(eq(quests.isActive, true), eq(quests.triggerType, actionType)),
  });

  for (const quest of activeQuests) {
    if (!quest.triggerThreshold) continue;

    const existing = await db.query.userQuests.findFirst({
      where: and(eq(userQuests.userId, userId), eq(userQuests.questId, quest.id)),
    });

    if (existing?.status === 'completed') continue;

    const newProgressRaw = (existing?.progress ?? 0) + incrementBy;
    const progressPct = Math.min(100, Math.round((newProgressRaw / quest.triggerThreshold) * 100));
    const completed = newProgressRaw >= quest.triggerThreshold;

    if (existing) {
      await db
        .update(userQuests)
        .set({ progress: progressPct, status: completed ? 'completed' : 'active', completedAt: completed ? new Date() : null })
        .where(eq(userQuests.id, existing.id));
    } else {
      await db.insert(userQuests).values({
        userId,
        questId: quest.id,
        status: completed ? 'completed' : 'active',
        progress: progressPct,
        startedAt: new Date(),
        completedAt: completed ? new Date() : null,
      });
    }

    if (completed && quest.pointsReward > 0) {
      await awardPoints({ userId, amount: quest.pointsReward, reason: 'quest_completed', sourceType: 'quest', sourceId: quest.id });
    }
  }
}
