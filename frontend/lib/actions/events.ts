'use server';

import { db } from '@/db';
import { events, eventParticipants, eventGalleryImages, users } from '@/db/schema';
import { eq, asc, and, gte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAdmin, requireAuth } from '@/lib/auth-helpers';
import { NotFoundError } from '@/lib/errors';
import {
  createEventSchema,
  updateEventSchema,
  requestEventParticipationSchema,
  evaluateEventParticipantSchema,
  addImpactGalleryImageSchema,
} from '@/lib/validations/events';
import { awardPoints } from '@/lib/actions/gamification';
import { notifyUser } from '@/lib/notify';

export async function getEvents() {
  const allEvents = await db
    .select()
    .from(events)
    .orderBy(asc(events.eventDate));

  return allEvents;
}

export async function getUpcomingEvents() {
  const now = new Date();
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(eq(events.status, 'upcoming'))
    .orderBy(asc(events.eventDate));

  return upcomingEvents;
}

export async function getEventById(id: string) {
  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  return event[0] || null;
}

export async function createEvent(data: z.infer<typeof createEventSchema>) {
  await requireAdmin();
  const input = createEventSchema.parse(data);

  await db.insert(events).values(input);

  revalidatePath('/events');
  revalidatePath('/admin/events');
}

export async function updateEvent(id: string, data: z.infer<typeof updateEventSchema>) {
  await requireAdmin();
  const input = updateEventSchema.parse(data);

  await db.update(events).set(input).where(eq(events.id, id));

  revalidatePath('/events');
  revalidatePath('/admin/events');
}

export async function deleteEvent(id: string) {
  await requireAdmin();

  await db.delete(events).where(eq(events.id, id));

  revalidatePath('/events');
  revalidatePath('/admin/events');
}

export async function getNextUpcomingEvent() {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.status, 'upcoming'), gte(events.eventDate, new Date())))
    .orderBy(asc(events.eventDate))
    .limit(1);

  return event || null;
}

export async function getEventParticipants(eventId: string) {
  return db
    .select({
      id: eventParticipants.id,
      userId: eventParticipants.userId,
      userName: users.name,
      intent: eventParticipants.intent,
      evaluationScore: eventParticipants.evaluationScore,
      evaluatedAt: eventParticipants.evaluatedAt,
    })
    .from(eventParticipants)
    .leftJoin(users, eq(eventParticipants.userId, users.id))
    .where(eq(eventParticipants.eventId, eventId));
}

// "Eventos" en Mi Perfil: misiones especiales ligadas a eventos, distintas de la sección
// pública de Eventos (spec).
export async function getUserEventParticipations(userId: string) {
  return db
    .select({
      id: eventParticipants.id,
      eventId: eventParticipants.eventId,
      eventTitle: events.title,
      intent: eventParticipants.intent,
      evaluationScore: eventParticipants.evaluationScore,
      appliesToScore: events.appliesToScore,
      scoreDescription: events.scoreDescription,
    })
    .from(eventParticipants)
    .leftJoin(events, eq(eventParticipants.eventId, events.id))
    .where(eq(eventParticipants.userId, userId));
}

export async function requestEventParticipation(eventId: string, data: z.infer<typeof requestEventParticipationSchema>) {
  const user = await requireAuth();
  const input = requestEventParticipationSchema.parse(data);

  await db.insert(eventParticipants).values({ eventId, userId: user.id, intent: input.intent }).onConflictDoNothing();
  revalidatePath(`/events/${eventId}`);
}

export async function evaluateEventParticipant(participantId: string, data: z.infer<typeof evaluateEventParticipantSchema>) {
  const admin = await requireAdmin();
  const input = evaluateEventParticipantSchema.parse(data);

  const participant = await db.query.eventParticipants.findFirst({ where: eq(eventParticipants.id, participantId) });
  if (!participant) throw new NotFoundError('Participante no encontrado');
  const event = await db.query.events.findFirst({ where: eq(events.id, participant.eventId) });
  if (!event) throw new NotFoundError('Evento no encontrado');

  await db
    .update(eventParticipants)
    .set({ evaluationScore: input.score, evaluatedAt: new Date(), evaluatedBy: admin.id })
    .where(eq(eventParticipants.id, participantId));

  if (event.appliesToScore && event.scorePoints) {
    await awardPoints({
      userId: participant.userId,
      amount: event.scorePoints,
      reason: 'event_participation',
      sourceType: 'event',
      sourceId: event.id,
      awardedBy: admin.id,
    });
    await notifyUser(participant.userId, 'Puntos por evento', `Recibiste ${event.scorePoints} puntos por tu participación en "${event.title}".`, 'success');
  }

  revalidatePath(`/events/${event.id}`);
  revalidatePath('/admin/events');
}

export async function getImpactGalleryImages() {
  return db.select().from(eventGalleryImages).orderBy(asc(eventGalleryImages.createdAt));
}

export async function addImpactGalleryImage(imageUrl: string, data: z.infer<typeof addImpactGalleryImageSchema>) {
  await requireAdmin();
  const input = addImpactGalleryImageSchema.parse(data);

  await db.insert(eventGalleryImages).values({ imageUrl, eventId: input.eventId, caption: input.caption });
  revalidatePath('/events');
}
