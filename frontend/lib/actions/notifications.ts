'use server';

import { db } from '@/db';
import { notifications, contactMessages, joinApplications, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAdmin, requireOwner } from '@/lib/auth-helpers';
import { NotFoundError } from '@/lib/errors';
import {
  createNotificationSchema,
  createContactMessageSchema,
  createJoinApplicationSchema,
  updateJoinApplicationStatusSchema,
} from '@/lib/validations/notifications';

// Notifications
export async function getUserNotifications(userId: string) {
  const userNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));

  return userNotifications;
}

export async function getUnreadNotificationCount(userId: string) {
  const result = await db
    .select({ count: db.$count(notifications, and(eq(notifications.userId, userId), eq(notifications.isRead, false))) })
    .from(notifications);

  return result[0]?.count || 0;
}

// Solo un admin puede disparar una notificación manual a un usuario arbitrario desde el panel.
// Las notificaciones generadas por el propio sistema (aprobaciones, puntos, etc) usan
// lib/notify.ts directamente desde la action que las origina.
export async function createNotification(data: z.infer<typeof createNotificationSchema>) {
  await requireAdmin();
  const input = createNotificationSchema.parse(data);

  await db.insert(notifications).values({
    ...input,
    type: input.type || 'info',
  });

  revalidatePath('/dashboard');
}

export async function markNotificationAsRead(id: string) {
  const notification = await db.query.notifications.findFirst({ where: eq(notifications.id, id) });
  if (!notification) throw new NotFoundError('Notificación no encontrada');
  await requireOwner(notification.userId ?? '');

  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));

  revalidatePath('/dashboard');
}

export async function markAllNotificationsAsRead(userId: string) {
  await requireOwner(userId);

  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));

  revalidatePath('/dashboard');
}

export async function deleteNotification(id: string) {
  const notification = await db.query.notifications.findFirst({ where: eq(notifications.id, id) });
  if (!notification) throw new NotFoundError('Notificación no encontrada');
  await requireOwner(notification.userId ?? '');

  await db.delete(notifications).where(eq(notifications.id, id));

  revalidatePath('/dashboard');
}

// Contact Messages
export async function createContactMessage(data: z.infer<typeof createContactMessageSchema>) {
  const input = createContactMessageSchema.parse(data);
  await db.insert(contactMessages).values(input);

  revalidatePath('/contact');
  revalidatePath('/admin/notifications');
}

export async function getContactMessages() {
  const allMessages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return allMessages;
}

export async function markContactMessageAsRead(id: string) {
  await requireAdmin();

  await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));

  revalidatePath('/admin/notifications');
}

export async function deleteContactMessage(id: string) {
  await requireAdmin();

  await db.delete(contactMessages).where(eq(contactMessages.id, id));

  revalidatePath('/admin/notifications');
}

// Join Applications
export async function createJoinApplication(data: z.infer<typeof createJoinApplicationSchema>) {
  const input = createJoinApplicationSchema.parse(data);
  await db.insert(joinApplications).values(input);

  revalidatePath('/join');
  revalidatePath('/admin/applications');
}

export async function getJoinApplications() {
  const allApplications = await db
    .select()
    .from(joinApplications)
    .orderBy(desc(joinApplications.createdAt));

  return allApplications;
}

export async function getJoinApplicationById(id: string) {
  const application = await db
    .select()
    .from(joinApplications)
    .where(eq(joinApplications.id, id))
    .limit(1);

  return application[0] || null;
}

export async function updateJoinApplicationStatus(id: string, status: z.infer<typeof updateJoinApplicationStatusSchema>['status']) {
  const admin = await requireAdmin();
  const input = updateJoinApplicationStatusSchema.parse({ status });

  await db.update(joinApplications).set({
    status: input.status,
    reviewedBy: admin.id,
    reviewedAt: new Date(),
  }).where(eq(joinApplications.id, id));

  revalidatePath('/admin/applications');
}

export async function deleteJoinApplication(id: string) {
  await requireAdmin();

  await db.delete(joinApplications).where(eq(joinApplications.id, id));

  revalidatePath('/admin/applications');
}
