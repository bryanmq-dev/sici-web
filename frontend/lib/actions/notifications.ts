'use server';

import { db } from '@/db';
import { notifications, contactMessages, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import bcrypt from 'bcryptjs';
import { requireAdmin, requireOwner } from '@/lib/auth-helpers';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { sendMail, approvalEmailHtml, rejectionEmailHtml } from '@/lib/mail';
import {
  createNotificationSchema,
  createContactMessageSchema,
  createRegistrationSchema,
  rejectRegistrationSchema,
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

// Registro / solicitud de ingreso — crea directamente en `users` con status='postulacion'
// (no puede loguear hasta que un admin apruebe, ver lib/auth.ts authorize()).
export async function createRegistration(data: z.infer<typeof createRegistrationSchema>) {
  const input = createRegistrationSchema.parse(data);

  const existing = await db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (existing) throw new ValidationError('Ya existe una cuenta con ese correo');

  const passwordHash = await bcrypt.hash(input.password, 10);
  await db.insert(users).values({
    name: input.fullName,
    email: input.email,
    passwordHash,
    semester: input.semester,
    interestArea: input.interestArea,
    motivation: input.motivation,
    status: 'postulacion',
  });

  revalidatePath('/admin/users');
}

export async function getPendingRegistrations() {
  await requireAdmin();
  return db
    .select()
    .from(users)
    .where(eq(users.status, 'postulacion'))
    .orderBy(desc(users.createdAt));
}

export async function approveRegistration(userId: string) {
  await requireAdmin();

  const [user] = await db
    .update(users)
    .set({ status: 'activo', statusReason: null })
    .where(eq(users.id, userId))
    .returning();
  if (!user) throw new NotFoundError('Usuario no encontrado');

  await sendMail({
    to: user.email,
    subject: 'Tu solicitud a la SICI fue aprobada',
    html: approvalEmailHtml(user.name, `${process.env.AUTH_URL ?? ''}/login`),
  });

  revalidatePath('/admin/users');
}

export async function rejectRegistration(data: z.infer<typeof rejectRegistrationSchema>) {
  await requireAdmin();
  const input = rejectRegistrationSchema.parse(data);

  const [user] = await db
    .update(users)
    .set({ status: 'inactivo', statusReason: input.reason })
    .where(eq(users.id, input.userId))
    .returning();
  if (!user) throw new NotFoundError('Usuario no encontrado');

  await sendMail({
    to: user.email,
    subject: 'Tu solicitud a la SICI fue rechazada',
    html: rejectionEmailHtml(user.name, input.reason),
  });

  revalidatePath('/admin/users');
}
