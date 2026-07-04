import { auth } from '@/lib/auth';
import { AuthError, ForbiddenError } from '@/lib/errors';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new AuthError();
  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') throw new ForbiddenError('Solo un administrador puede realizar esta acción');
  return user;
}

export async function requireOwner(ownerId: string) {
  const user = await requireAuth();
  if (user.id !== ownerId && user.role !== 'admin') {
    throw new ForbiddenError('No eres el propietario de este recurso');
  }
  return user;
}
