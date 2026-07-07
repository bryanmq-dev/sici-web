import { z } from 'zod';

export const EVENT_STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;
export const EVENT_PARTICIPATION_INTENTS = ['collaborate', 'support', 'attend'] as const;

export const createEventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  eventDate: z.coerce.date(),
  eventType: z.string().min(1).max(50),
  image: z.string().max(500).optional(),
  link: z.string().max(500).optional(),
  location: z.string().max(255).optional(),
  status: z.enum(EVENT_STATUSES).optional(),
  appliesToScore: z.boolean().optional(),
  scoreDescription: z.string().max(255).optional(),
  scorePoints: z.number().int().min(0).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const requestEventParticipationSchema = z.object({
  intent: z.enum(EVENT_PARTICIPATION_INTENTS),
});

export const evaluateEventParticipantSchema = z.object({
  score: z.number().int().min(0).max(100),
});

export const addImpactGalleryImageSchema = z.object({
  eventId: z.string().uuid().optional(),
  caption: z.string().max(255).optional(),
});
