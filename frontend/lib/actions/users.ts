'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';
import { updateUserSchema, setUserRoleSchema } from '@/lib/validations/users';

export async function updateUser(id: string, data: z.infer<typeof updateUserSchema>) {
  await requireAdmin();
  const input = updateUserSchema.parse(data);

  await db.update(users).set(input).where(eq(users.id, id));
  revalidatePath('/admin/users');
}

export async function setUserRole(id: string, data: z.infer<typeof setUserRoleSchema>) {
  await requireAdmin();
  const input = setUserRoleSchema.parse(data);

  await db.update(users).set({ role: input.role }).where(eq(users.id, id));
  revalidatePath('/admin/users');
}

export async function deleteUser(id: string) {
  await requireAdmin();

  await db.delete(users).where(eq(users.id, id));
  revalidatePath('/admin/users');
}
