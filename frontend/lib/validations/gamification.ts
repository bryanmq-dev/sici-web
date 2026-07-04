import { z } from 'zod';

export const createAchievementSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(255),
  icon: z.string().max(100).optional(),
  description: z.string().optional(),
  achievedAt: z.string().optional(),
});

export const awardPointsSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int(),
  reason: z.string().min(1).max(100),
  sourceType: z.string().max(50).optional(),
  sourceId: z.string().uuid().optional(),
  awardedBy: z.string().uuid().nullable().optional(),
});

export const BADGE_RARITIES = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'] as const;

export const createBadgeSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(100).optional(),
  rarity: z.enum(BADGE_RARITIES),
  description: z.string().optional(),
});

export const createQuestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().min(1).max(50),
  difficulty: z.string().min(1).max(50),
  pointsReward: z.coerce.number().int().min(0),
  triggerType: z.string().max(50).optional(),
  triggerThreshold: z.coerce.number().int().min(1).optional(),
});
