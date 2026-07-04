import { z } from 'zod';

export const NOTIFICATION_TYPES = ['info', 'success', 'warning', 'error'] as const;

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  type: z.enum(NOTIFICATION_TYPES).optional(),
});

export const createContactMessageSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  subject: z.string().max(255).optional(),
  message: z.string().min(1),
});

export const JOIN_APPLICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;

export const createJoinApplicationSchema = z.object({
  fullName: z.string().min(1).max(255),
  email: z.string().email().max(255),
  semester: z.coerce.number().int().min(1).max(20),
  interestArea: z.string().min(1).max(255),
  motivation: z.string().min(1),
});

export const updateJoinApplicationStatusSchema = z.object({
  status: z.enum(JOIN_APPLICATION_STATUSES),
});
