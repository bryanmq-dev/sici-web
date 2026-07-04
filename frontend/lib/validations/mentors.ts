import { z } from 'zod';

export const MENTOR_TYPES = ['docente', 'estudiante'] as const;

export const mentorSkillSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
});

export const createMentorSchema = z.object({
  specialty: z.string().min(1).max(255),
  experience: z.string().optional(),
  mentorType: z.enum(MENTOR_TYPES),
  skills: z.array(mentorSkillSchema).optional(),
});

export const updateMentorSchema = createMentorSchema.partial().extend({
  isActive: z.boolean().optional(),
});
