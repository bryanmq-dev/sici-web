import { z } from 'zod';

export const updateUserBioSchema = z.object({
  bio: z.string().max(2000),
});

export const socialsSchema = z.object({
  github: z.string().max(255).optional(),
  linkedin: z.string().max(255).optional(),
  twitter: z.string().max(255).optional(),
  website: z.string().max(255).optional(),
});

export const addUserSkillSchema = z.object({
  skillName: z.string().min(1).max(100),
});
