import { z } from 'zod';

export const createIncubatorProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  content: z.string().optional(),
  status: z.string().max(50).optional(),
  categories: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  client: z.string().max(255).optional(),
  image: z.string().max(500).optional(),
});

export const updateIncubatorProjectSchema = createIncubatorProjectSchema.partial();

export const requestToJoinSchema = z.object({
  message: z.string().max(1000).optional(),
});

export const createSuggestionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});

export const TEAM_MEMBER_ROLES = ['dev', 'admin'] as const;

export const setTeamMemberRoleSchema = z.object({
  role: z.enum(TEAM_MEMBER_ROLES),
});

export const evaluateTeamMemberSchema = z.object({
  score: z.number().int().min(0).max(100),
});
