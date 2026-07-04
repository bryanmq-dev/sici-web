/**
 * Verificación Fase 3: título dinámico por género, tope de 2 Vocales, y revocación de admin
 * al remover el último cargo directivo.
 *
 * assignDirectiveRole/removeDirectiveRole están gateadas con requireAdmin (no invocables desde
 * un script plano), así que este script replica la misma lógica transaccional contra la DB real.
 *
 * Uso: pnpm verify:phase3
 */
import 'dotenv/config';
import { db } from '../db';
import { users, societyUnits, societyMemberships } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { genderizeTitle } from '../lib/utils';
import { MAX_VOCAL_SEATS } from '../lib/constants/organization';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`OK: ${msg}`);
}

const DIRECTIVA_UNIT_NAME = '__verify_phase3_directiva__';

async function assignRole(unitId: string, userId: string, role: string) {
  return db.transaction(async (tx) => {
    if (role === 'Vocal') {
      const vocals = await tx.select({ id: societyMemberships.id }).from(societyMemberships).where(and(eq(societyMemberships.unitId, unitId), eq(societyMemberships.role, 'Vocal'), eq(societyMemberships.isActive, true)));
      if (vocals.length >= MAX_VOCAL_SEATS) throw new Error('no_vocal_seats');
    }
    await tx.insert(societyMemberships).values({ userId, unitId, role, isActive: true, since: new Date().toISOString().split('T')[0] });
    await tx.update(users).set({ role: 'admin' }).where(eq(users.id, userId));
  });
}

async function removeRole(unitId: string, membershipId: string, userId: string) {
  return db.transaction(async (tx) => {
    await tx.update(societyMemberships).set({ isActive: false }).where(eq(societyMemberships.id, membershipId));
    const remaining = await tx.select({ id: societyMemberships.id }).from(societyMemberships).where(and(eq(societyMemberships.userId, userId), eq(societyMemberships.unitId, unitId), eq(societyMemberships.isActive, true)));
    if (remaining.length === 0) {
      await tx.update(users).set({ role: 'student' }).where(eq(users.id, userId));
    }
  });
}

async function main() {
  assert(genderizeTitle('Secretario de Investigación', 'F') === 'Secretaria de Investigación', 'genderizeTitle F -> Secretaria de Investigación');
  assert(genderizeTitle('Secretario de Investigación', 'M') === 'Secretario de Investigación', 'genderizeTitle M -> se mantiene Secretario');
  assert(genderizeTitle('Vocal', 'F') === 'Vocal', 'genderizeTitle no cambia "Vocal" (invariante en español)');
  assert(genderizeTitle('Presidente', 'F') === 'Presidente', 'genderizeTitle no fuerza "Presidenta" (spec solo pide secretario/a)');

  const [unit] = await db.insert(societyUnits).values({ name: DIRECTIVA_UNIT_NAME }).returning();
  const testUsers = await db.insert(users).values(
    Array.from({ length: 3 }, (_, i) => ({ email: `__verify_phase3_${i}@test.local`, name: `Verify ${i}`, passwordHash: 'x' }))
  ).returning();

  try {
    await assignRole(unit.id, testUsers[0].id, 'Vocal');
    await assignRole(unit.id, testUsers[1].id, 'Vocal');
    let thirdFailed = false;
    try {
      await assignRole(unit.id, testUsers[2].id, 'Vocal');
    } catch {
      thirdFailed = true;
    }
    assert(thirdFailed, 'un 3er Vocal es rechazado (tope de 2 cupos)');

    const [user0] = await db.select({ role: users.role }).from(users).where(eq(users.id, testUsers[0].id));
    assert(user0.role === 'admin', 'asignar cargo directivo otorga rol admin');

    const membership0 = await db.query.societyMemberships.findFirst({ where: and(eq(societyMemberships.userId, testUsers[0].id), eq(societyMemberships.unitId, unit.id)) });
    if (!membership0) throw new Error('membership0 no encontrada');
    await removeRole(unit.id, membership0.id, testUsers[0].id);

    const [user0After] = await db.select({ role: users.role }).from(users).where(eq(users.id, testUsers[0].id));
    assert(user0After.role === 'student', 'remover el único cargo directivo revoca el rol admin');

    console.log('\nFase 3: título dinámico, tope de Vocales y revocación de admin verificados.');
  } finally {
    await db.delete(societyMemberships).where(eq(societyMemberships.unitId, unit.id));
    for (const u of testUsers) {
      await db.delete(users).where(eq(users.id, u.id));
    }
    await db.delete(societyUnits).where(eq(societyUnits.id, unit.id));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
