import { z } from 'zod';
import { INSTITUTIONAL_EMAIL_DOMAIN } from '@/lib/constants/auth';

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

export const createRegistrationSchema = z.object({
  fullName: z.string().min(1).max(255),
  email: z.string().email().max(255).refine((v) => v.toLowerCase().endsWith(`@${INSTITUTIONAL_EMAIL_DOMAIN}`), {
    message: `El correo debe ser institucional (@${INSTITUTIONAL_EMAIL_DOMAIN})`,
  }),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  semester: z.coerce.number().int().min(1).max(20),
  interestArea: z.string().min(1).max(255),
  motivation: z.string().min(1),
});

export const rejectRegistrationSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1, 'El motivo de rechazo es obligatorio').max(1000),
});
