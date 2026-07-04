'use server';

import { db } from '@/db';
import { mentors, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAuth, requireOwner } from '@/lib/auth-helpers';
import { NotFoundError } from '@/lib/errors';
import { createMentorSchema, updateMentorSchema } from '@/lib/validations/mentors';

export async function getMentors() {
  const allMentors = await db
    .select({
      id: mentors.id,
      specialty: mentors.specialty,
      experience: mentors.experience,
      mentorType: mentors.mentorType,
      skills: mentors.skills,
      isActive: mentors.isActive,
      createdAt: mentors.createdAt,
      userName: users.name,
      userEmail: users.email,
      userAvatar: users.avatar,
      userId: mentors.userId,
    })
    .from(mentors)
    .leftJoin(users, eq(mentors.userId, users.id))
    .where(eq(mentors.isActive, true));

  return allMentors;
}

export async function getMentorById(id: string) {
  const mentor = await db
    .select({
      id: mentors.id,
      specialty: mentors.specialty,
      experience: mentors.experience,
      mentorType: mentors.mentorType,
      skills: mentors.skills,
      isActive: mentors.isActive,
      createdAt: mentors.createdAt,
      userName: users.name,
      userEmail: users.email,
      userAvatar: users.avatar,
      userId: mentors.userId,
    })
    .from(mentors)
    .leftJoin(users, eq(mentors.userId, users.id))
    .where(eq(mentors.id, id))
    .limit(1);

  return mentor[0] || null;
}

export async function createMentor(data: z.infer<typeof createMentorSchema>) {
  const user = await requireAuth();
  const input = createMentorSchema.parse(data);

  await db.insert(mentors).values({ ...input, userId: user.id });

  revalidatePath('/mentors');
  revalidatePath('/admin/mentors');
}

export async function updateMentor(id: string, data: z.infer<typeof updateMentorSchema>) {
  const mentor = await db.query.mentors.findFirst({ where: eq(mentors.id, id) });
  if (!mentor) throw new NotFoundError('Mentor no encontrado');
  await requireOwner(mentor.userId ?? '');

  const input = updateMentorSchema.parse(data);
  await db.update(mentors).set(input).where(eq(mentors.id, id));

  revalidatePath('/mentors');
  revalidatePath('/admin/mentors');
}

export async function deleteMentor(id: string) {
  const mentor = await db.query.mentors.findFirst({ where: eq(mentors.id, id) });
  if (!mentor) throw new NotFoundError('Mentor no encontrado');
  await requireOwner(mentor.userId ?? '');

  await db.delete(mentors).where(eq(mentors.id, id));

  revalidatePath('/mentors');
  revalidatePath('/admin/mentors');
}
