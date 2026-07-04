'use server';

import { db } from '@/db';
import { projects, projectCoAuthors, projectSupportRequests, users } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAuth, requireAdmin, requireOwner } from '@/lib/auth-helpers';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { createProjectSchema, updateProjectSchema, requestSupportSchema } from '@/lib/validations/projects';
import { awardPoints } from '@/lib/actions/gamification';
import { notifyUser } from '@/lib/notify';
import { checkAndProgressQuests } from '@/lib/quest-engine';

const PROJECT_COLUMNS = {
  id: projects.id,
  title: projects.title,
  description: projects.description,
  content: projects.content,
  category: projects.category,
  tags: projects.tags,
  image: projects.image,
  likes: projects.likes,
  featured: projects.featured,
  status: projects.status,
  impactScore: projects.impactScore,
  supportSlots: projects.supportSlots,
  createdAt: projects.createdAt,
  authorName: users.name,
  authorId: projects.authorId,
};

// Listado público — solo proyectos aprobados por el admin.
export async function getProjects() {
  return db
    .select(PROJECT_COLUMNS)
    .from(projects)
    .leftJoin(users, eq(projects.authorId, users.id))
    .where(eq(projects.status, 'approved'))
    .orderBy(desc(projects.createdAt));
}

export async function getProjectsForAdmin() {
  await requireAdmin();
  return db
    .select(PROJECT_COLUMNS)
    .from(projects)
    .leftJoin(users, eq(projects.authorId, users.id))
    .orderBy(desc(projects.createdAt));
}

export async function getProjectById(id: string) {
  const project = await db
    .select(PROJECT_COLUMNS)
    .from(projects)
    .leftJoin(users, eq(projects.authorId, users.id))
    .where(eq(projects.id, id))
    .limit(1);

  return project[0] || null;
}

export async function getProjectCoAuthors(projectId: string) {
  return db
    .select({ id: projectCoAuthors.id, userId: projectCoAuthors.userId, name: users.name, avatar: users.avatar, addedAt: projectCoAuthors.addedAt })
    .from(projectCoAuthors)
    .leftJoin(users, eq(projectCoAuthors.userId, users.id))
    .where(eq(projectCoAuthors.projectId, projectId));
}

export async function getProjectSupportRequests(projectId: string) {
  return db
    .select({
      id: projectSupportRequests.id,
      userId: projectSupportRequests.userId,
      userName: users.name,
      message: projectSupportRequests.message,
      status: projectSupportRequests.status,
      createdAt: projectSupportRequests.createdAt,
    })
    .from(projectSupportRequests)
    .leftJoin(users, eq(projectSupportRequests.userId, users.id))
    .where(eq(projectSupportRequests.projectId, projectId));
}

export async function createProject(data: z.infer<typeof createProjectSchema>) {
  const user = await requireAuth();
  const input = createProjectSchema.parse(data);

  await db.insert(projects).values({
    ...input,
    authorId: user.id,
    status: 'pending',
  });

  revalidatePath('/projects');
  revalidatePath('/admin/projects');
}

export async function updateProject(id: string, data: z.infer<typeof updateProjectSchema>) {
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');
  await requireOwner(project.authorId ?? '');

  const input = updateProjectSchema.parse(data);
  await db.update(projects).set(input).where(eq(projects.id, id));

  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
  revalidatePath('/admin/projects');
}

export async function deleteProject(id: string) {
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');
  await requireOwner(project.authorId ?? '');

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath('/projects');
  revalidatePath('/admin/projects');
}

const PROJECT_APPROVAL_POINTS = 100;
const PROJECT_COAUTHOR_POINTS = 40;

export async function approveProject(id: string) {
  const admin = await requireAdmin();
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');

  await db.update(projects).set({ status: 'approved' }).where(eq(projects.id, id));

  if (project.authorId) {
    await awardPoints({ userId: project.authorId, amount: PROJECT_APPROVAL_POINTS, reason: 'project_approved', sourceType: 'project', sourceId: id, awardedBy: admin.id });
    await checkAndProgressQuests(project.authorId, 'project_approved');
    await notifyUser(project.authorId, 'Proyecto aprobado', `Tu proyecto "${project.title}" fue aprobado y ya es público.`, 'success');
  }
  const coAuthors = await db.select({ userId: projectCoAuthors.userId }).from(projectCoAuthors).where(eq(projectCoAuthors.projectId, id));
  for (const ca of coAuthors) {
    await awardPoints({ userId: ca.userId, amount: PROJECT_COAUTHOR_POINTS, reason: 'project_approved_coauthor', sourceType: 'project', sourceId: id, awardedBy: admin.id });
  }

  revalidatePath('/projects');
  revalidatePath('/admin/projects');
}

export async function rejectProject(id: string) {
  await requireAdmin();
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');

  await db.update(projects).set({ status: 'rejected' }).where(eq(projects.id, id));
  if (project.authorId) {
    await notifyUser(project.authorId, 'Proyecto rechazado', `Tu proyecto "${project.title}" no fue aprobado.`, 'warning');
  }

  revalidatePath('/admin/projects');
}

export async function requestSupport(projectId: string, data: z.infer<typeof requestSupportSchema>) {
  const user = await requireAuth();
  const input = requestSupportSchema.parse(data);

  const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');

  const approvedCount = await db
    .select({ id: projectSupportRequests.id })
    .from(projectSupportRequests)
    .where(and(eq(projectSupportRequests.projectId, projectId), eq(projectSupportRequests.status, 'approved')));
  if (approvedCount.length >= project.supportSlots) {
    throw new ValidationError('Este proyecto ya no tiene cupos de apoyo disponibles');
  }

  await db.insert(projectSupportRequests).values({ projectId, userId: user.id, message: input.message });
  revalidatePath(`/projects/${projectId}`);
}

export async function respondToSupportRequest(requestId: string, approve: boolean) {
  const request = await db.query.projectSupportRequests.findFirst({ where: eq(projectSupportRequests.id, requestId) });
  if (!request) throw new NotFoundError('Solicitud no encontrada');
  const project = await db.query.projects.findFirst({ where: eq(projects.id, request.projectId) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');
  await requireOwner(project.authorId ?? '');

  // db.transaction + FOR UPDATE serializa aprobaciones concurrentes sobre el mismo proyecto:
  // sin el lock, dos respondToSupportRequest simultáneos podrían leer el mismo conteo de
  // cupos antes de que ninguno confirme, vendiendo más cupos de los que hay (mismo tipo de
  // race que los likes en Fase 0, aquí con impacto real de negocio).
  await db.transaction(async (tx) => {
    if (approve) {
      await tx.execute(sql`SELECT id FROM ${projects} WHERE id = ${request.projectId} FOR UPDATE`);
      const approvedCount = await tx
        .select({ id: projectSupportRequests.id })
        .from(projectSupportRequests)
        .where(and(eq(projectSupportRequests.projectId, request.projectId), eq(projectSupportRequests.status, 'approved')));
      if (approvedCount.length >= project.supportSlots) {
        throw new ValidationError('No quedan cupos de apoyo disponibles');
      }
    }

    await tx
      .update(projectSupportRequests)
      .set({ status: approve ? 'approved' : 'rejected', respondedAt: new Date() })
      .where(eq(projectSupportRequests.id, requestId));
  });

  await notifyUser(
    request.userId,
    approve ? 'Solicitud de apoyo aprobada' : 'Solicitud de apoyo rechazada',
    `Tu solicitud para apoyar "${project.title}" fue ${approve ? 'aprobada' : 'rechazada'}.`,
    approve ? 'success' : 'info'
  );

  revalidatePath(`/projects/${request.projectId}`);
}

export async function promoteCoAuthor(projectId: string, userId: string) {
  const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');
  await requireOwner(project.authorId ?? '');

  await db.insert(projectCoAuthors).values({ projectId, userId }).onConflictDoNothing();
  revalidatePath(`/projects/${projectId}`);
}

export async function demoteCoAuthor(projectId: string, userId: string) {
  const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
  if (!project) throw new NotFoundError('Proyecto no encontrado');
  await requireOwner(project.authorId ?? '');

  await db.delete(projectCoAuthors).where(and(eq(projectCoAuthors.projectId, projectId), eq(projectCoAuthors.userId, userId)));
  revalidatePath(`/projects/${projectId}`);
}

// "Mis Proyectos" en Mi Perfil.
export async function getMyProjects(userId: string) {
  return db.select(PROJECT_COLUMNS).from(projects).leftJoin(users, eq(projects.authorId, users.id)).where(eq(projects.authorId, userId));
}

export async function getMySupportRequestsSent(userId: string) {
  return db
    .select({ id: projectSupportRequests.id, projectId: projectSupportRequests.projectId, projectTitle: projects.title, status: projectSupportRequests.status })
    .from(projectSupportRequests)
    .leftJoin(projects, eq(projectSupportRequests.projectId, projects.id))
    .where(eq(projectSupportRequests.userId, userId));
}
