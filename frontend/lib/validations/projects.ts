import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  content: z.string().optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().max(500).optional(),
  supportSlots: z.number().int().min(0).max(50).optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  featured: z.boolean().optional(),
  impactScore: z.number().int().min(0).optional(),
});

export const requestSupportSchema = z.object({
  message: z.string().max(1000).optional(),
});
