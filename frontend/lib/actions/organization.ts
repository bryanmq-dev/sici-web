'use server';

import { db } from '@/db';
import { societyUnits, societyMemberships, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { requireAdmin } from '@/lib/auth-helpers';
import { ValidationError } from '@/lib/errors';
import { DIRECTIVE_ROLES, MAX_VOCAL_SEATS, type DirectiveRole } from '@/lib/constants/organization';
import {
  createSocietyUnitSchema,
  updateSocietyUnitSchema,
  createSocietyMembershipSchema,
  updateSocietyMembershipSchema,
  assignDirectiveRoleSchema,
} from '@/lib/validations/organization';

export async function getSocietyUnits() {
  const allUnits = await db
    .select()
    .from(societyUnits)
    .orderBy(societyUnits.name);

  return allUnits;
}

export async function getSocietyUnitById(id: string) {
  const unit = await db
    .select()
    .from(societyUnits)
    .where(eq(societyUnits.id, id))
    .limit(1);

  return unit[0] || null;
}

export async function getSocietyMemberships() {
  const allMemberships = await db
    .select({
      id: societyMemberships.id,
      role: societyMemberships.role,
      since: societyMemberships.since,
      isActive: societyMemberships.isActive,
      userId: societyMemberships.userId,
      unitId: societyMemberships.unitId,
      userName: users.name,
      userAvatar: users.avatar,
      userEmail: users.email,
      userGender: users.gender,
      unitName: societyUnits.name,
    })
    .from(societyMemberships)
    .leftJoin(users, eq(societyMemberships.userId, users.id))
    .leftJoin(societyUnits, eq(societyMemberships.unitId, societyUnits.id))
    .where(eq(societyMemberships.isActive, true))
    .orderBy(societyUnits.name, users.name);

  return allMemberships;
}

export async function getMembershipsByUnit(unitId: string) {
  const memberships = await db
    .select({
      id: societyMemberships.id,
      role: societyMemberships.role,
      since: societyMemberships.since,
      isActive: societyMemberships.isActive,
      userId: societyMemberships.userId,
      userName: users.name,
      userAvatar: users.avatar,
      userEmail: users.email,
    })
    .from(societyMemberships)
    .leftJoin(users, eq(societyMemberships.userId, users.id))
    .where(eq(societyMemberships.unitId, unitId))
    .orderBy(users.name);

  return memberships;
}

export async function createSocietyUnit(data: z.infer<typeof createSocietyUnitSchema>) {
  await requireAdmin();
  const input = createSocietyUnitSchema.parse(data);

  await db.insert(societyUnits).values(input);

  revalidatePath('/team');
  revalidatePath('/admin/organization');
}

export async function updateSocietyUnit(id: string, data: z.infer<typeof updateSocietyUnitSchema>) {
  await requireAdmin();
  const input = updateSocietyUnitSchema.parse(data);

  await db.update(societyUnits).set(input).where(eq(societyUnits.id, id));

  revalidatePath('/team');
  revalidatePath('/admin/organization');
}

export async function deleteSocietyUnit(id: string) {
  await requireAdmin();

  await db.transaction(async (tx) => {
    await tx.delete(societyMemberships).where(eq(societyMemberships.unitId, id));
    await tx.delete(societyUnits).where(eq(societyUnits.id, id));
  });

  revalidatePath('/team');
  revalidatePath('/admin/organization');
}

export async function createSocietyMembership(data: z.infer<typeof createSocietyMembershipSchema>) {
  await requireAdmin();
  const input = createSocietyMembershipSchema.parse(data);

  await db.insert(societyMemberships).values({
    ...input,
    since: input.since || new Date().toISOString().split('T')[0],
  });

  revalidatePath('/team');
  revalidatePath('/admin/organization');
}

export async function updateSocietyMembership(id: string, data: z.infer<typeof updateSocietyMembershipSchema>) {
  await requireAdmin();
  const input = updateSocietyMembershipSchema.parse(data);

  await db.update(societyMemberships).set(input).where(eq(societyMemberships.id, id));

  revalidatePath('/team');
  revalidatePath('/admin/organization');
}

export async function deleteSocietyMembership(id: string) {
  await requireAdmin();

  await db.delete(societyMemberships).where(eq(societyMemberships.id, id));

  revalidatePath('/team');
  revalidatePath('/admin/organization');
}

const DIRECTIVA_UNIT_NAME = 'Directiva';

export async function assignDirectiveRole(data: z.infer<typeof assignDirectiveRoleSchema>) {
  await requireAdmin();
  const input = assignDirectiveRoleSchema.parse(data);

  await db.transaction(async (tx) => {
    let unit = await tx.query.societyUnits.findFirst({ where: eq(societyUnits.name, DIRECTIVA_UNIT_NAME) });
    if (!unit) {
      [unit] = await tx.insert(societyUnits).values({ name: DIRECTIVA_UNIT_NAME }).returning();
    }

    if (input.role === 'Vocal') {
      const vocals = await tx
        .select({ id: societyMemberships.id })
        .from(societyMemberships)
        .where(and(eq(societyMemberships.unitId, unit.id), eq(societyMemberships.role, 'Vocal'), eq(societyMemberships.isActive, true)));
      if (vocals.length >= MAX_VOCAL_SEATS) {
        throw new ValidationError(`Ya se asignaron los ${MAX_VOCAL_SEATS} cupos de Vocal`);
      }
    } else {
      const occupied = await tx.query.societyMemberships.findFirst({
        where: and(eq(societyMemberships.unitId, unit.id), eq(societyMemberships.role, input.role), eq(societyMemberships.isActive, true)),
      });
      if (occupied && occupied.userId !== input.userId) {
        throw new ValidationError(`El cargo "${input.role}" ya está ocupado`);
      }
    }

    await tx.insert(societyMemberships).values({
      userId: input.userId,
      unitId: unit.id,
      role: input.role,
      since: new Date().toISOString().split('T')[0],
      isActive: true,
    });
    await tx.update(users).set({ gender: input.gender, role: 'admin' }).where(eq(users.id, input.userId));
  });

  revalidatePath('/team');
  revalidatePath('/admin/organization');
}

export async function removeDirectiveRole(membershipId: string) {
  await requireAdmin();

  await db.transaction(async (tx) => {
    const membership = await tx.query.societyMemberships.findFirst({ where: eq(societyMemberships.id, membershipId) });
    if (!membership || !membership.userId) return;

    await tx.update(societyMemberships).set({ isActive: false }).where(eq(societyMemberships.id, membershipId));

    const directiva = await tx.query.societyUnits.findFirst({ where: eq(societyUnits.name, DIRECTIVA_UNIT_NAME) });
    const remaining = directiva
      ? await tx
          .select({ id: societyMemberships.id })
          .from(societyMemberships)
          .where(and(eq(societyMemberships.userId, membership.userId), eq(societyMemberships.unitId, directiva.id), eq(societyMemberships.isActive, true)))
      : [];

    // Revoca admin solo si no le queda ningún otro cargo directivo activo.
    if (remaining.length === 0) {
      await tx.update(users).set({ role: 'student' }).where(eq(users.id, membership.userId));
    }
  });

  revalidatePath('/team');
  revalidatePath('/admin/organization');
}
