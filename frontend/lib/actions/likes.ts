'use server';

import { db } from '@/db';
import { contentLikes, projects, articles, forumQuestions, forumAnswers, users, pointsLedger } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth-helpers';

export type LikeTargetType = 'project' | 'article' | 'forum_question' | 'forum_answer';

const POINTS_ANSWER_LIKED = 2;

export async function toggleLike(targetType: LikeTargetType, targetId: string) {
  const user = await requireAuth();

  const liked = await db.transaction(async (tx) => {
    const existing = await tx.query.contentLikes.findFirst({
      where: and(
        eq(contentLikes.userId, user.id),
        eq(contentLikes.targetType, targetType),
        eq(contentLikes.targetId, targetId)
      ),
    });

    const delta = existing ? -1 : 1;

    if (existing) {
      await tx.delete(contentLikes).where(eq(contentLikes.id, existing.id));
    } else {
      await tx.insert(contentLikes).values({ userId: user.id, targetType, targetId });
    }

    switch (targetType) {
      case 'project':
        await tx.update(projects).set({ likes: sql`${projects.likes} + ${delta}` }).where(eq(projects.id, targetId));
        break;
      case 'article':
        await tx.update(articles).set({ likes: sql`${articles.likes} + ${delta}` }).where(eq(articles.id, targetId));
        break;
      case 'forum_question':
        await tx.update(forumQuestions).set({ likes: sql`${forumQuestions.likes} + ${delta}` }).where(eq(forumQuestions.id, targetId));
        break;
      case 'forum_answer': {
        await tx.update(forumAnswers).set({ likes: sql`${forumAnswers.likes} + ${delta}` }).where(eq(forumAnswers.id, targetId));
        // Puntos al autor de la respuesta solo al dar like (no al quitarlo) y no por auto-like.
        if (delta === 1) {
          const answer = await tx.query.forumAnswers.findFirst({ where: eq(forumAnswers.id, targetId) });
          if (answer?.authorId && answer.authorId !== user.id) {
            await tx.insert(pointsLedger).values({ userId: answer.authorId, amount: POINTS_ANSWER_LIKED, reason: 'forum_answer_liked', sourceType: 'forum_answer', sourceId: targetId });
            await tx.update(users).set({ isiPoints: sql`${users.isiPoints} + ${POINTS_ANSWER_LIKED}` }).where(eq(users.id, answer.authorId));
          }
        }
        break;
      }
    }

    return !existing;
  });

  const revalidateByTarget: Record<LikeTargetType, string[]> = {
    project: ['/projects', `/projects/${targetId}`],
    article: ['/articles', `/articles/${targetId}`],
    forum_question: ['/forum', `/forum/${targetId}`],
    forum_answer: ['/forum'],
  };
  revalidateByTarget[targetType].forEach((path) => revalidatePath(path));

  return { liked };
}
