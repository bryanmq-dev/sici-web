'use server';

import { db } from '@/db';
import { projects, articles, incubatorProjects, mentorshipRequests, forumQuestions, userSkills, users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAuth } from '@/lib/auth-helpers';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { updateUserBioSchema, socialsSchema, addUserSkillSchema } from '@/lib/validations/profile';

// Todas las mutaciones de perfil derivan el usuario objetivo de la sesión — nunca aceptan
// un userId como parámetro (cierra el mismo tipo de hueco que Fase 0 corrigió en otras actions).

export async function getUserContributions(userId: string) {
  const [userProjects, userArticles, userIncubatorProjects, userMentorships, userForumQuestions] = await Promise.all([
    db.select({ id: projects.id, title: projects.title, status: projects.status }).from(projects).where(eq(projects.authorId, userId)),
    db.select({ id: articles.id, title: articles.title, status: articles.status }).from(articles).where(sql`${articles.authorIds} @> ARRAY[${userId}]::uuid[]`),
    db.select({ id: incubatorProjects.id, title: incubatorProjects.title, status: incubatorProjects.approvalStatus }).from(incubatorProjects).where(eq(incubatorProjects.authorId, userId)),
    db.select({ id: mentorshipRequests.id, title: mentorshipRequests.topic, status: mentorshipRequests.status }).from(mentorshipRequests).where(eq(mentorshipRequests.studentId, userId)),
    db.select({ id: forumQuestions.id, title: forumQuestions.title, status: sql<string>`case when ${forumQuestions.isSolved} then 'resuelta' else 'abierta' end` }).from(forumQuestions).where(eq(forumQuestions.authorId, userId)),
  ]);

  return {
    projects: userProjects,
    articles: userArticles,
    incubatorProjects: userIncubatorProjects,
    mentorships: userMentorships,
    forumQuestions: userForumQuestions,
  };
}

export async function updateUserBio(data: z.infer<typeof updateUserBioSchema>) {
  const user = await requireAuth();
  const input = updateUserBioSchema.parse(data);

  await db.update(users).set({ bio: input.bio }).where(eq(users.id, user.id));
  revalidatePath('/profile');
}

export async function updateUserSocials(data: z.infer<typeof socialsSchema>) {
  const user = await requireAuth();
  const input = socialsSchema.parse(data);

  await db.update(users).set({ socials: input }).where(eq(users.id, user.id));
  revalidatePath('/profile');
}

export async function updateUserAvatar(url: string) {
  const user = await requireAuth();
  await db.update(users).set({ avatar: url }).where(eq(users.id, user.id));
  revalidatePath('/profile');
}

export async function getUserSkills(userId: string) {
  return db.select().from(userSkills).where(eq(userSkills.userId, userId));
}

export async function addUserSkill(data: z.infer<typeof addUserSkillSchema>) {
  const user = await requireAuth();
  const input = addUserSkillSchema.parse(data);

  await db.insert(userSkills).values({ userId: user.id, skillName: input.skillName }).onConflictDoNothing();
  revalidatePath('/profile');
}

export async function removeUserSkill(skillId: string) {
  const user = await requireAuth();

  const skill = await db.query.userSkills.findFirst({ where: eq(userSkills.id, skillId) });
  if (!skill) throw new NotFoundError('Skill no encontrada');
  if (skill.userId !== user.id) throw new ForbiddenError('No puedes eliminar skills de otro usuario');

  await db.delete(userSkills).where(eq(userSkills.id, skillId));
  revalidatePath('/profile');
}
