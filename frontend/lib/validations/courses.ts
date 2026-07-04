import { z } from 'zod';

export const COURSE_STATUSES = ['active', 'finished', 'upcoming'] as const;

export const courseLessonGroupSchema = z.object({
  title: z.string(),
  lessons: z.array(z.string()).optional(),
});

export const createCourseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  duration: z.string().max(100).optional(),
  instructorId: z.string().uuid().optional(),
  syllabus: z.array(courseLessonGroupSchema).optional(),
  category: z.string().max(100).optional(),
  status: z.enum(COURSE_STATUSES).optional(),
  image: z.string().max(500).optional(),
  gallery: z.array(z.string()).optional(),
  objective: z.string().optional(),
  results: z.string().optional(),
  relevantInfo: z.string().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();
