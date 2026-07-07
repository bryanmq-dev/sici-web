'use server';

import { db } from '@/db';
import { incubatorProjects, incubatorTeamMembers, incubatorJoinRequests, incubatorSuggestions, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAuth, requireAdmin, requireOwner } from '@/lib/auth-helpers';
import { NotFoundError } from '@/lib/errors';
import {
  createIncubatorProjectSchema,
  updateIncubatorProjectSchema,
  requestToJoinSchema,
  createSuggestionSchema,
  setTeamMemberRoleSchema,
  evaluateTeamMemberSchema,
} from '@/lib/validations/incubator';
import { awardPoints } from '@/lib/actions/gamification';
import { notifyUser } from '@/lib/notify';

const INCUBATOR_COLUMNS = {
  id: incubatorProjects.id,
  title: incubatorProjects.title,
  description: incubatorProjects.description,
  content: incubatorProjects.content,
  status: incubatorProjects.status,
  approvalStatus: incubatorProjects.approvalStatus,
  categories: incubatorProjects.categories,
  technologies: incubatorProjects.technologies,
  client: incubatorProjects.client,
  image: incubatorProjects.image,
  createdAt: incubatorProjects.createdAt,
  authorName: users.name,
  authorId: incubatorProjects.authorId,
};

export async function getIncubatorProjects() {
  return db
    .select(INCUBATOR_COLUMNS)
    .from(incubatorProjects)
    .leftJoin(users, eq(incubatorProjects.authorId, users.id))
    .where(eq(incubatorProjects.approvalStatus, 'approved'))
    .orderBy(desc(incubatorProjects.createdAt));
}

export async function getIncubatorProjectsForAdmin() {
  await requireAdmin();
  return db
    .select(INCUBATOR_COLUMNS)
    .from(incubatorProjects)
    .leftJoin(users, eq(incubatorProjects.authorId, users.id))
    .orderBy(desc(incubatorProjects.createdAt));
}

export async function getIncubatorProjectById(id: string) {
  const project = await db
    .select(INCUBATOR_COLUMNS)
    .from(incubatorProjects)
    .leftJoin(users, eq(incubatorProjects.authorId, users.id))
    .where(eq(incubatorProjects.id, id))
    .limit(1);

  return project[0] || null;
}

export async function getIncubatorTeamMembers(projectId: string) {
  return db
    .select({ id: incubatorTeamMembers.id, userId: incubatorTeamMembers.userId, name: users.name, role: incubatorTeamMembers.role, finalScore: incubatorTeamMembers.finalScore })
    .from(incubatorTeamMembers)
    .leftJoin(users, eq(incubatorTeamMembers.userId, users.id))
    .where(eq(incubatorTeamMembers.incubatorProjectId, projectId));
}

export async function getIncubatorJoinRequests(projectId: string) {
  return db
    .select({ id: incubatorJoinRequests.id, userId: incubatorJoinRequests.userId, userName: users.name, message: incubatorJoinRequests.message, status: incubatorJoinRequests.status })
    .from(incubatorJoinRequests)
    .leftJoin(users, eq(incubatorJoinRequests.userId, users.id))
    .where(eq(incubatorJoinRequests.incubatorProjectId, projectId));
}

export async function createIncubatorProject(data: z.infer<typeof createIncubatorProjectSchema>) {
  const user = await requireAuth();
  const input = createIncubatorProjectSchema.parse(data);

  const [project] = await db.insert(incubatorProjects).values({
    ...input,
    authorId: user.id,
    approvalStatus: 'pending',
  }).returning();

  // El creador es admin del proyecto dentro de la incubadora.
  await db.insert(incubatorTeamMembers).values({ incubatorProjectId: project.id, userId: user.id, role: 'admin' });

  revalidatePath('/incubator');
  revalidatePath('/admin/incubator');
}

// A diferencia de createIncubatorProject (estudiante, nace 'pending'), el admin es la
// autoridad de aprobación — el proyecto nace directamente 'approved' y sin agregar al admin
// como miembro del equipo (el equipo real se gestiona aparte, vía solicitudes de unión).
export async function createIncubatorProjectAsAdmin(data: z.infer<typeof createIncubatorProjectSchema>) {
  const admin = await requireAdmin();
  const input = createIncubatorProjectSchema.parse(data);

  await db.insert(incubatorProjects).values({
    ...input,
    authorId: admin.id,
    approvalStatus: 'approved',
  });

  revalidatePath('/incubator');
  revalidatePath('/admin/incubator');
}

export async function updateIncubatorProject(id: string, data: z.infer<typeof updateIncubatorProjectSchema>) {
  const project = await db.query.incubatorProjects.findFirst({ where: eq(incubatorProjects.id, id) });
  if (!project) throw new NotFoundError('Proyecto de incubadora no encontrado');
  await requireOwner(project.authorId ?? '');

  const input = updateIncubatorProjectSchema.parse(data);
  await db.update(incubatorProjects).set(input).where(eq(incubatorProjects.id, id));

  revalidatePath('/incubator');
  revalidatePath('/admin/incubator');
}

export async function deleteIncubatorProject(id: string) {
  const project = await db.query.incubatorProjects.findFirst({ where: eq(incubatorProjects.id, id) });
  if (!project) throw new NotFoundError('Proyecto de incubadora no encontrado');
  await requireOwner(project.authorId ?? '');

  await db.delete(incubatorProjects).where(eq(incubatorProjects.id, id));

  revalidatePath('/incubator');
  revalidatePath('/admin/incubator');
}

export async function approveIncubatorProject(id: string) {
  await requireAdmin();
  const project = await db.query.incubatorProjects.findFirst({ where: eq(incubatorProjects.id, id) });
  if (!project) throw new NotFoundError('Proyecto de incubadora no encontrado');

  await db.update(incubatorProjects).set({ approvalStatus: 'approved' }).where(eq(incubatorProjects.id, id));
  if (project.authorId) {
    await notifyUser(project.authorId, 'Proyecto de incubadora aprobado', `Tu propuesta "${project.title}" fue aprobada.`, 'success');
  }

  revalidatePath('/incubator');
  revalidatePath('/admin/incubator');
}

export async function rejectIncubatorProject(id: string) {
  await requireAdmin();
  const project = await db.query.incubatorProjects.findFirst({ where: eq(incubatorProjects.id, id) });
  if (!project) throw new NotFoundError('Proyecto de incubadora no encontrado');

  await db.update(incubatorProjects).set({ approvalStatus: 'rejected' }).where(eq(incubatorProjects.id, id));
  if (project.authorId) {
    await notifyUser(project.authorId, 'Proyecto de incubadora rechazado', `Tu propuesta "${project.title}" no fue aprobada.`, 'warning');
  }

  revalidatePath('/admin/incubator');
}

export async function requestToJoin(projectId: string, data: z.infer<typeof requestToJoinSchema>) {
  const user = await requireAuth();
  const input = requestToJoinSchema.parse(data);

  await db.insert(incubatorJoinRequests).values({ incubatorProjectId: projectId, userId: user.id, message: input.message });
  revalidatePath(`/incubator/${projectId}`);
}

export async function respondToJoinRequest(requestId: string, approve: boolean) {
  const request = await db.query.incubatorJoinRequests.findFirst({ where: eq(incubatorJoinRequests.id, requestId) });
  if (!request) throw new NotFoundError('Solicitud no encontrada');
  const project = await db.query.incubatorProjects.findFirst({ where: eq(incubatorProjects.id, request.incubatorProjectId) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');
  await requireOwner(project.authorId ?? '');

  await db.update(incubatorJoinRequests).set({ status: approve ? 'approved' : 'rejected', respondedAt: new Date() }).where(eq(incubatorJoinRequests.id, requestId));

  if (approve) {
    await db.insert(incubatorTeamMembers).values({ incubatorProjectId: request.incubatorProjectId, userId: request.userId, role: 'dev' }).onConflictDoNothing();
  }

  await notifyUser(
    request.userId,
    approve ? 'Solicitud de incubadora aprobada' : 'Solicitud de incubadora rechazada',
    `Tu solicitud para unirte a "${project.title}" fue ${approve ? 'aprobada' : 'rechazada'}.`,
    approve ? 'success' : 'info'
  );

  revalidatePath(`/incubator/${request.incubatorProjectId}`);
}

export async function setTeamMemberRole(memberId: string, data: z.infer<typeof setTeamMemberRoleSchema>) {
  const input = setTeamMemberRoleSchema.parse(data);
  const member = await db.query.incubatorTeamMembers.findFirst({ where: eq(incubatorTeamMembers.id, memberId) });
  if (!member) throw new NotFoundError('Miembro no encontrado');
  const project = await db.query.incubatorProjects.findFirst({ where: eq(incubatorProjects.id, member.incubatorProjectId) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');
  await requireOwner(project.authorId ?? '');

  await db.update(incubatorTeamMembers).set({ role: input.role }).where(eq(incubatorTeamMembers.id, memberId));
  revalidatePath(`/incubator/${member.incubatorProjectId}`);
}

const INCUBATOR_EVALUATION_POINTS_PER_SCORE = 1;

export async function evaluateTeamMember(memberId: string, data: z.infer<typeof evaluateTeamMemberSchema>) {
  const admin = await requireAuth();
  const input = evaluateTeamMemberSchema.parse(data);

  const member = await db.query.incubatorTeamMembers.findFirst({ where: eq(incubatorTeamMembers.id, memberId) });
  if (!member) throw new NotFoundError('Miembro no encontrado');
  const project = await db.query.incubatorProjects.findFirst({ where: eq(incubatorProjects.id, member.incubatorProjectId) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');
  await requireOwner(project.authorId ?? '');

  await db.update(incubatorTeamMembers).set({ finalScore: input.score, evaluatedAt: new Date() }).where(eq(incubatorTeamMembers.id, memberId));

  await awardPoints({
    userId: member.userId,
    amount: input.score * INCUBATOR_EVALUATION_POINTS_PER_SCORE,
    reason: 'incubator_evaluation',
    sourceType: 'incubator_project',
    sourceId: project.id,
    awardedBy: admin.id,
  });

  revalidatePath(`/incubator/${member.incubatorProjectId}`);
}

export async function createSuggestion(data: z.infer<typeof createSuggestionSchema>) {
  const user = await requireAuth();
  const input = createSuggestionSchema.parse(data);

  await db.insert(incubatorSuggestions).values({ ...input, userId: user.id });
  revalidatePath('/incubator');
}

export async function getSuggestionsForAdmin() {
  await requireAdmin();
  return db.select().from(incubatorSuggestions).where(eq(incubatorSuggestions.status, 'pending')).orderBy(desc(incubatorSuggestions.createdAt));
}

// "Mi Incubadora" en Mi Perfil.
export async function getMyIncubatorProjects(userId: string) {
  return db.select(INCUBATOR_COLUMNS).from(incubatorProjects).leftJoin(users, eq(incubatorProjects.authorId, users.id)).where(eq(incubatorProjects.authorId, userId));
}

export async function getMyIncubatorMemberships(userId: string) {
  return db
    .select({ id: incubatorTeamMembers.id, incubatorProjectId: incubatorTeamMembers.incubatorProjectId, projectTitle: incubatorProjects.title, role: incubatorTeamMembers.role, finalScore: incubatorTeamMembers.finalScore })
    .from(incubatorTeamMembers)
    .leftJoin(incubatorProjects, eq(incubatorTeamMembers.incubatorProjectId, incubatorProjects.id))
    .where(eq(incubatorTeamMembers.userId, userId));
}
