import { z } from 'zod';
import { DIRECTIVE_ROLES } from '@/lib/constants/organization';

export const createSocietyUnitSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export const updateSocietyUnitSchema = createSocietyUnitSchema.partial();

export const createSocietyMembershipSchema = z.object({
  userId: z.string().uuid(),
  unitId: z.string().uuid(),
  role: z.string().min(1).max(100),
  since: z.string().optional(),
});

export const updateSocietyMembershipSchema = z.object({
  role: z.string().max(100).optional(),
  since: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const assignDirectiveRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(DIRECTIVE_ROLES),
  gender: z.enum(['M', 'F']).optional(),
});
