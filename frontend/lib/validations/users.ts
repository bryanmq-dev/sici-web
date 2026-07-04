import { z } from 'zod';

export const USER_ROLES = ['student', 'admin'] as const;

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  semester: z.coerce.number().int().min(1).max(20).optional(),
});

export const setUserRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});
