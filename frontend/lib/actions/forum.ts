'use server';

import { db } from '@/db';
import { forumQuestions, forumAnswers, users, pointsLedger } from '@/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAuth, requireOwner } from '@/lib/auth-helpers';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { createForumQuestionSchema, createForumAnswerSchema } from '@/lib/validations/forum';
import { awardPoints } from '@/lib/actions/gamification';
import { notifyUser } from '@/lib/notify';
import { checkAndProgressQuests } from '@/lib/quest-engine';

const POINTS_QUESTION_POSTED = 1;
const POINTS_ANSWER_POSTED = 3;
const POINTS_ANSWER_ACCEPTED = 50;

export async function getForumQuestions() {
  const allQuestions = await db
    .select({
      id: forumQuestions.id,
      title: forumQuestions.title,
      description: forumQuestions.description,
      tags: forumQuestions.tags,
      views: forumQuestions.views,
      likes: forumQuestions.likes,
      isSolved: forumQuestions.isSolved,
      featuredAnswerId: forumQuestions.featuredAnswerId,
      createdAt: forumQuestions.createdAt,
      authorName: users.name,
      authorId: forumQuestions.authorId,
    })
    .from(forumQuestions)
    .leftJoin(users, eq(forumQuestions.authorId, users.id))
    .orderBy(desc(forumQuestions.createdAt));

  return allQuestions;
}

export async function getForumQuestionById(id: string) {
  const question = await db
    .select({
      id: forumQuestions.id,
      title: forumQuestions.title,
      description: forumQuestions.description,
      tags: forumQuestions.tags,
      views: forumQuestions.views,
      likes: forumQuestions.likes,
      isSolved: forumQuestions.isSolved,
      featuredAnswerId: forumQuestions.featuredAnswerId,
      createdAt: forumQuestions.createdAt,
      authorName: users.name,
      authorId: forumQuestions.authorId,
    })
    .from(forumQuestions)
    .leftJoin(users, eq(forumQuestions.authorId, users.id))
    .where(eq(forumQuestions.id, id))
    .limit(1);

  return question[0] || null;
}

export async function getForumAnswers(questionId: string) {
  const answers = await db
    .select({
      id: forumAnswers.id,
      content: forumAnswers.content,
      images: forumAnswers.images,
      likes: forumAnswers.likes,
      parentReplyId: forumAnswers.parentReplyId,
      createdAt: forumAnswers.createdAt,
      authorName: users.name,
      authorId: forumAnswers.authorId,
    })
    .from(forumAnswers)
    .leftJoin(users, eq(forumAnswers.authorId, users.id))
    .where(eq(forumAnswers.questionId, questionId))
    .orderBy(desc(forumAnswers.likes));

  return answers;
}

export async function createForumQuestion(data: z.infer<typeof createForumQuestionSchema>) {
  const user = await requireAuth();
  const input = createForumQuestionSchema.parse(data);

  await db.insert(forumQuestions).values({
    ...input,
    authorId: user.id,
  });

  await awardPoints({ userId: user.id, amount: POINTS_QUESTION_POSTED, reason: 'forum_question_posted' });

  revalidatePath('/forum');
}

export async function createForumAnswer(data: z.infer<typeof createForumAnswerSchema>) {
  const user = await requireAuth();
  const input = createForumAnswerSchema.parse(data);

  // Tope de 2 niveles: no se puede responder a una respuesta que ya es, a su vez, una respuesta.
  if (input.parentReplyId) {
    const parent = await db.query.forumAnswers.findFirst({ where: eq(forumAnswers.id, input.parentReplyId) });
    if (!parent) throw new NotFoundError('Respuesta padre no encontrada');
    if (parent.parentReplyId) {
      throw new ForbiddenError('Solo se admiten 2 niveles de respuesta');
    }
  }

  await db.insert(forumAnswers).values({
    ...input,
    authorId: user.id,
  });

  await awardPoints({ userId: user.id, amount: POINTS_ANSWER_POSTED, reason: 'forum_answer_posted' });
  await checkAndProgressQuests(user.id, 'forum_answer_posted');

  revalidatePath(`/forum/${input.questionId}`);
}

export async function incrementQuestionViews(id: string) {
  await db
    .update(forumQuestions)
    .set({ views: sql`${forumQuestions.views} + 1` })
    .where(eq(forumQuestions.id, id));
}

export async function markAnswerAccepted(questionId: string, answerId: string) {
  const question = await db.query.forumQuestions.findFirst({ where: eq(forumQuestions.id, questionId) });
  if (!question) throw new NotFoundError('Pregunta no encontrada');
  const admin = await requireOwner(question.authorId ?? '');

  const answer = await db.query.forumAnswers.findFirst({ where: eq(forumAnswers.id, answerId) });
  if (!answer) throw new NotFoundError('Respuesta no encontrada');

  await db.update(forumQuestions).set({ featuredAnswerId: answerId, isSolved: true }).where(eq(forumQuestions.id, questionId));

  if (answer.authorId) {
    await awardPoints({ userId: answer.authorId, amount: POINTS_ANSWER_ACCEPTED, reason: 'forum_answer_accepted', sourceType: 'forum_answer', sourceId: answerId, awardedBy: admin.id });

    const priorAcceptance = await db
      .select({ id: pointsLedger.id })
      .from(pointsLedger)
      .where(and(eq(pointsLedger.userId, answer.authorId), eq(pointsLedger.reason, 'forum_answer_accepted')))
      .limit(2);
    if (priorAcceptance.length === 1) {
      // Esta es la primera vez que se le acepta una respuesta — notificar el hito.
      await notifyUser(answer.authorId, '¡Primera respuesta aceptada!', 'Tu primera respuesta fue marcada como solución en el foro.', 'success');
    }
  }

  revalidatePath(`/forum/${questionId}`);
}

export async function deleteForumQuestion(id: string) {
  const question = await db.query.forumQuestions.findFirst({ where: eq(forumQuestions.id, id) });
  if (!question) throw new NotFoundError('Pregunta no encontrada');
  await requireOwner(question.authorId ?? '');

  await db.transaction(async (tx) => {
    await tx.delete(forumAnswers).where(eq(forumAnswers.questionId, id));
    await tx.delete(forumQuestions).where(eq(forumQuestions.id, id));
  });

  revalidatePath('/forum');
}
