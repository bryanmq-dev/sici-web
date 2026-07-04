import { z } from 'zod';

export const MENTORSHIP_STATUSES = ['pending', 'accepted', 'completed', 'rejected', 'cancelled'] as const;
export const MENTORSHIP_KINDS = ['open', 'request'] as const;

export const createMentorshipSchema = z
  .object({
    topic: z.string().min(1).max(255),
    description: z.string().min(1),
    kind: z.enum(MENTORSHIP_KINDS),
    mentorId: z.string().uuid().optional(),
    syllabusUrl: z.string().max(500).optional(),
    categories: z.array(z.string().min(1).max(100)).optional(),
  })
  .refine((data) => data.kind !== 'open' || !!data.syllabusUrl, {
    message: 'Una mentoría abierta requiere subir un temario en PDF',
    path: ['syllabusUrl'],
  });

export const updateMentorshipRequestSchema = z.object({
  status: z.enum(MENTORSHIP_STATUSES).optional(),
  mentorId: z.string().uuid().optional(),
});

export const finishOpenMentorshipSchema = z.object({
  evaluations: z.array(z.object({ userId: z.string().uuid(), score: z.number().int().min(0).max(100) })),
});

export const completeRequestMentorshipSchema = z.object({
  rating: z.number().int().min(1).max(5),
  ratingComment: z.string().max(1000).optional(),
});
