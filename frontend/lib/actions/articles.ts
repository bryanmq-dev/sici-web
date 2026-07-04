'use server';

import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAuth, requireAdmin } from '@/lib/auth-helpers';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { createArticleSchema, updateArticleSchema } from '@/lib/validations/articles';
import { awardPoints } from '@/lib/actions/gamification';
import { notifyUser } from '@/lib/notify';
import { checkAndProgressQuests } from '@/lib/quest-engine';

async function requireArticleAuthor(authorIds: string[] | null) {
  const user = await requireAuth();
  if (user.role !== 'admin' && !authorIds?.includes(user.id)) {
    throw new ForbiddenError('No eres autor de este artículo');
  }
  return user;
}

// Listado público — solo artículos aprobados por el admin.
export async function getArticles() {
  const allArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, 'approved'))
    .orderBy(desc(articles.createdAt));

  return allArticles;
}

export async function getArticlesForAdmin() {
  await requireAdmin();
  return db.select().from(articles).orderBy(desc(articles.createdAt));
}

export async function getArticleById(id: string) {
  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  return article[0] || null;
}

export async function createArticle(data: z.infer<typeof createArticleSchema>) {
  const user = await requireAuth();
  const input = createArticleSchema.parse(data);

  await db.insert(articles).values({
    ...input,
    authorIds: input.authorIds && input.authorIds.length > 0 ? input.authorIds : [user.id],
    status: 'pending',
  });

  revalidatePath('/articles');
  revalidatePath('/admin/articles');
}

const ARTICLE_APPROVAL_POINTS = 100;

export async function approveArticle(id: string) {
  const admin = await requireAdmin();
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!article) throw new NotFoundError('Artículo no encontrado');

  await db.update(articles).set({ status: 'approved', publicationDate: new Date().toISOString().split('T')[0] }).where(eq(articles.id, id));

  for (const authorId of article.authorIds ?? []) {
    await awardPoints({ userId: authorId, amount: ARTICLE_APPROVAL_POINTS, reason: 'article_approved', sourceType: 'article', sourceId: id, awardedBy: admin.id });
    await checkAndProgressQuests(authorId, 'article_approved');
    await notifyUser(authorId, 'Artículo aprobado', `Tu artículo "${article.title}" fue aprobado y publicado.`, 'success');
  }

  revalidatePath('/articles');
  revalidatePath('/admin/articles');
}

export async function rejectArticle(id: string) {
  await requireAdmin();
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!article) throw new NotFoundError('Artículo no encontrado');

  await db.update(articles).set({ status: 'rejected' }).where(eq(articles.id, id));
  for (const authorId of article.authorIds ?? []) {
    await notifyUser(authorId, 'Artículo rechazado', `Tu artículo "${article.title}" no fue aprobado.`, 'warning');
  }

  revalidatePath('/admin/articles');
}

export async function updateArticle(id: string, data: z.infer<typeof updateArticleSchema>) {
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!article) throw new NotFoundError('Artículo no encontrado');
  await requireArticleAuthor(article.authorIds);

  const input = updateArticleSchema.parse(data);
  await db.update(articles).set(input).where(eq(articles.id, id));

  revalidatePath('/articles');
  revalidatePath(`/articles/${id}`);
  revalidatePath('/admin/articles');
}

export async function deleteArticle(id: string) {
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!article) throw new NotFoundError('Artículo no encontrado');
  await requireArticleAuthor(article.authorIds);

  await db.delete(articles).where(eq(articles.id, id));

  revalidatePath('/articles');
  revalidatePath('/admin/articles');
}
