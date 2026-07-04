'use server';

import { db } from '@/db';
import { mentorshipRequests, mentorshipCategories, mentorshipCategoryLinks, mentorshipParticipants, users, mentors } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAuth, requireAdmin } from '@/lib/auth-helpers';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import {
  createMentorshipSchema,
  updateMentorshipRequestSchema,
  finishOpenMentorshipSchema,
  completeRequestMentorshipSchema,
} from '@/lib/validations/mentorship';
import { awardPoints } from '@/lib/actions/gamification';
import { notifyUser } from '@/lib/notify';

async function requireMentorshipParty(request: { studentId: string | null; mentorId: string | null }) {
  const user = await requireAuth();
  if (user.role === 'admin' || user.id === request.studentId) return user;
  if (request.mentorId) {
    const mentor = await db.query.mentors.findFirst({ where: eq(mentors.id, request.mentorId) });
    if (mentor?.userId === user.id) return user;
  }
  throw new ForbiddenError('No participas en esta mentoría');
}

async function findOrCreateCategory(name: string) {
  const trimmed = name.trim();
  const existing = await db.query.mentorshipCategories.findFirst({ where: eq(mentorshipCategories.name, trimmed) });
  if (existing) return existing;
  const [created] = await db.insert(mentorshipCategories).values({ name: trimmed }).onConflictDoNothing().returning();
  if (created) return created;
  // Carrera: otra request creó la misma categoría entre el findFirst y el insert.
  const race = await db.query.mentorshipCategories.findFirst({ where: eq(mentorshipCategories.name, trimmed) });
  if (!race) throw new Error('No se pudo crear la categoría');
  return race;
}

export async function getMentorshipCategories() {
  return db.select().from(mentorshipCategories).orderBy(mentorshipCategories.name);
}

export async function getMentorshipRequests() {
  return db
    .select({
      id: mentorshipRequests.id,
      topic: mentorshipRequests.topic,
      description: mentorshipRequests.description,
      status: mentorshipRequests.status,
      kind: mentorshipRequests.kind,
      approvalStatus: mentorshipRequests.approvalStatus,
      syllabusUrl: mentorshipRequests.syllabusUrl,
      createdAt: mentorshipRequests.createdAt,
      studentName: users.name,
      studentId: mentorshipRequests.studentId,
      mentorId: mentorshipRequests.mentorId,
    })
    .from(mentorshipRequests)
    .leftJoin(users, eq(mentorshipRequests.studentId, users.id))
    .where(eq(mentorshipRequests.approvalStatus, 'approved'))
    .orderBy(desc(mentorshipRequests.createdAt));
}

export async function getMentorshipRequestsForAdmin() {
  await requireAdmin();
  return db
    .select({
      id: mentorshipRequests.id,
      topic: mentorshipRequests.topic,
      approvalStatus: mentorshipRequests.approvalStatus,
      kind: mentorshipRequests.kind,
      status: mentorshipRequests.status,
      createdAt: mentorshipRequests.createdAt,
      studentName: users.name,
    })
    .from(mentorshipRequests)
    .leftJoin(users, eq(mentorshipRequests.studentId, users.id))
    .orderBy(desc(mentorshipRequests.createdAt));
}

export async function getMentorshipRequestById(id: string) {
  const request = await db
    .select({
      id: mentorshipRequests.id,
      topic: mentorshipRequests.topic,
      description: mentorshipRequests.description,
      status: mentorshipRequests.status,
      kind: mentorshipRequests.kind,
      approvalStatus: mentorshipRequests.approvalStatus,
      syllabusUrl: mentorshipRequests.syllabusUrl,
      rating: mentorshipRequests.rating,
      createdAt: mentorshipRequests.createdAt,
      studentName: users.name,
      studentId: mentorshipRequests.studentId,
      mentorId: mentorshipRequests.mentorId,
    })
    .from(mentorshipRequests)
    .leftJoin(users, eq(mentorshipRequests.studentId, users.id))
    .where(eq(mentorshipRequests.id, id))
    .limit(1);

  return request[0] || null;
}

export async function getMentorshipCategoriesFor(mentorshipId: string) {
  return db
    .select({ id: mentorshipCategories.id, name: mentorshipCategories.name })
    .from(mentorshipCategoryLinks)
    .leftJoin(mentorshipCategories, eq(mentorshipCategoryLinks.categoryId, mentorshipCategories.id))
    .where(eq(mentorshipCategoryLinks.mentorshipId, mentorshipId));
}

export async function getMentorshipParticipants(mentorshipId: string) {
  return db
    .select({ id: mentorshipParticipants.id, userId: mentorshipParticipants.userId, userName: users.name, role: mentorshipParticipants.role, attendanceConfirmed: mentorshipParticipants.attendanceConfirmed, evaluationScore: mentorshipParticipants.evaluationScore })
    .from(mentorshipParticipants)
    .leftJoin(users, eq(mentorshipParticipants.userId, users.id))
    .where(eq(mentorshipParticipants.mentorshipId, mentorshipId));
}

export async function createMentorship(data: z.infer<typeof createMentorshipSchema>) {
  const user = await requireAuth();
  const input = createMentorshipSchema.parse(data);

  const [request] = await db
    .insert(mentorshipRequests)
    .values({
      topic: input.topic,
      description: input.description,
      kind: input.kind,
      mentorId: input.mentorId,
      syllabusUrl: input.syllabusUrl,
      studentId: user.id,
      status: input.kind === 'open' ? 'accepted' : 'pending',
      approvalStatus: 'pending',
    })
    .returning();

  for (const name of input.categories ?? []) {
    const category = await findOrCreateCategory(name);
    await db.insert(mentorshipCategoryLinks).values({ mentorshipId: request.id, categoryId: category.id }).onConflictDoNothing();
  }

  if (input.kind === 'open') {
    await db.insert(mentorshipParticipants).values({ mentorshipId: request.id, userId: user.id, role: 'leader' });
  }

  revalidatePath('/mentorship');
  revalidatePath('/admin/mentorship');
}

export async function approveMentorship(id: string) {
  await requireAdmin();
  const request = await db.query.mentorshipRequests.findFirst({ where: eq(mentorshipRequests.id, id) });
  if (!request) throw new NotFoundError('Mentoría no encontrada');

  await db.update(mentorshipRequests).set({ approvalStatus: 'approved' }).where(eq(mentorshipRequests.id, id));
  if (request.studentId) {
    await notifyUser(request.studentId, 'Mentoría aprobada', `Tu mentoría "${request.topic}" fue aprobada.`, 'success');
  }

  revalidatePath('/mentorship');
  revalidatePath('/admin/mentorship');
}

export async function rejectMentorship(id: string) {
  await requireAdmin();
  const request = await db.query.mentorshipRequests.findFirst({ where: eq(mentorshipRequests.id, id) });
  if (!request) throw new NotFoundError('Mentoría no encontrada');

  await db.update(mentorshipRequests).set({ approvalStatus: 'rejected' }).where(eq(mentorshipRequests.id, id));
  if (request.studentId) {
    await notifyUser(request.studentId, 'Mentoría rechazada', `Tu mentoría "${request.topic}" no fue aprobada.`, 'warning');
  }

  revalidatePath('/admin/mentorship');
}

export async function updateMentorshipRequest(id: string, data: z.infer<typeof updateMentorshipRequestSchema>) {
  const request = await db.query.mentorshipRequests.findFirst({ where: eq(mentorshipRequests.id, id) });
  if (!request) throw new NotFoundError('Solicitud de mentoría no encontrada');
  await requireMentorshipParty(request);

  const input = updateMentorshipRequestSchema.parse(data);
  await db.update(mentorshipRequests).set(input).where(eq(mentorshipRequests.id, id));

  revalidatePath('/mentorship');
  revalidatePath('/admin/mentorship');
}

export async function deleteMentorshipRequest(id: string) {
  const request = await db.query.mentorshipRequests.findFirst({ where: eq(mentorshipRequests.id, id) });
  if (!request) throw new NotFoundError('Solicitud de mentoría no encontrada');
  await requireMentorshipParty(request);

  await db.delete(mentorshipRequests).where(eq(mentorshipRequests.id, id));

  revalidatePath('/mentorship');
  revalidatePath('/admin/mentorship');
}

export async function joinOpenMentorship(id: string) {
  const user = await requireAuth();
  const request = await db.query.mentorshipRequests.findFirst({ where: eq(mentorshipRequests.id, id) });
  if (!request) throw new NotFoundError('Mentoría no encontrada');
  if (request.kind !== 'open' || request.approvalStatus !== 'approved') {
    throw new ForbiddenError('Esta mentoría no admite nuevos participantes');
  }

  await db.insert(mentorshipParticipants).values({ mentorshipId: id, userId: user.id, role: 'mentee' }).onConflictDoNothing();
  revalidatePath(`/mentorship/${id}`);
}

const MENTORSHIP_LEADER_POINTS = 80;
const MENTORSHIP_MENTEE_POINTS = 20;

export async function finishOpenMentorship(id: string, data: z.infer<typeof finishOpenMentorshipSchema>) {
  const request = await db.query.mentorshipRequests.findFirst({ where: eq(mentorshipRequests.id, id) });
  if (!request) throw new NotFoundError('Mentoría no encontrada');
  const user = await requireAuth();
  if (user.id !== request.studentId && user.role !== 'admin') {
    throw new ForbiddenError('Solo el líder de la mentoría puede finalizarla');
  }
  const input = finishOpenMentorshipSchema.parse(data);

  await db.update(mentorshipRequests).set({ status: 'completed' }).where(eq(mentorshipRequests.id, id));

  if (request.studentId) {
    await awardPoints({ userId: request.studentId, amount: MENTORSHIP_LEADER_POINTS, reason: 'mentorship_led', sourceType: 'mentorship', sourceId: id, awardedBy: user.id });
  }

  for (const evaluation of input.evaluations) {
    await db
      .update(mentorshipParticipants)
      .set({ attendanceConfirmed: true, evaluationScore: evaluation.score, evaluatedAt: new Date() })
      .where(and(eq(mentorshipParticipants.mentorshipId, id), eq(mentorshipParticipants.userId, evaluation.userId)));

    await awardPoints({ userId: evaluation.userId, amount: MENTORSHIP_MENTEE_POINTS, reason: 'mentorship_attended', sourceType: 'mentorship', sourceId: id, awardedBy: user.id });
  }

  revalidatePath(`/mentorship/${id}`);
}

const MENTORSHIP_REQUESTER_POINTS = 15;
const MENTORSHIP_HELPER_POINTS = 40;

export async function completeRequestMentorship(id: string, data: z.infer<typeof completeRequestMentorshipSchema>) {
  const request = await db.query.mentorshipRequests.findFirst({ where: eq(mentorshipRequests.id, id) });
  if (!request) throw new NotFoundError('Solicitud no encontrada');
  const user = await requireAuth();
  if (user.id !== request.studentId && user.role !== 'admin') {
    throw new ForbiddenError('Solo quien solicitó la mentoría puede marcarla como completada');
  }
  const input = completeRequestMentorshipSchema.parse(data);

  await db.update(mentorshipRequests).set({ status: 'completed', rating: input.rating, ratingComment: input.ratingComment }).where(eq(mentorshipRequests.id, id));

  if (request.studentId) {
    await awardPoints({ userId: request.studentId, amount: MENTORSHIP_REQUESTER_POINTS, reason: 'mentorship_request_completed', sourceType: 'mentorship', sourceId: id, awardedBy: user.id });
  }
  if (request.mentorId) {
    const mentor = await db.query.mentors.findFirst({ where: eq(mentors.id, request.mentorId) });
    if (mentor?.userId) {
      await awardPoints({ userId: mentor.userId, amount: MENTORSHIP_HELPER_POINTS, reason: 'mentorship_helped', sourceType: 'mentorship', sourceId: id, awardedBy: user.id });
      await notifyUser(mentor.userId, 'Mentoría completada', `"${request.topic}" fue marcada como completada y calificada.`, 'success');
    }
  }

  revalidatePath(`/mentorship/${id}`);
}

export async function cancelRequestMentorship(id: string) {
  const request = await db.query.mentorshipRequests.findFirst({ where: eq(mentorshipRequests.id, id) });
  if (!request) throw new NotFoundError('Solicitud no encontrada');
  const user = await requireAuth();
  if (user.id !== request.studentId && user.role !== 'admin') {
    throw new ForbiddenError('Solo quien solicitó la mentoría puede cancelarla');
  }

  await db.update(mentorshipRequests).set({ status: 'cancelled' }).where(eq(mentorshipRequests.id, id));
  revalidatePath(`/mentorship/${id}`);
}

// "Mis Mentorías" en Mi Perfil.
export async function getMyMentorships(userId: string) {
  return db
    .select({ id: mentorshipRequests.id, topic: mentorshipRequests.topic, kind: mentorshipRequests.kind, status: mentorshipRequests.status, approvalStatus: mentorshipRequests.approvalStatus })
    .from(mentorshipRequests)
    .where(eq(mentorshipRequests.studentId, userId));
}

export async function getMyMentoringRequests(userId: string) {
  const mentor = await db.query.mentors.findFirst({ where: eq(mentors.userId, userId) });
  if (!mentor) return [];

  return db
    .select({ id: mentorshipRequests.id, topic: mentorshipRequests.topic, status: mentorshipRequests.status, studentName: users.name })
    .from(mentorshipRequests)
    .leftJoin(users, eq(mentorshipRequests.studentId, users.id))
    .where(eq(mentorshipRequests.mentorId, mentor.id));
}
