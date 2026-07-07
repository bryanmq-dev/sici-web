'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Para páginas cuyo único propósito es una acción autenticada (publicar, postular, etc.):
// evita mostrar el formulario completo a alguien sin sesión solo para que falle al enviar.
export function useRequireAuth() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  return { isReady: status === 'authenticated', isLoading: status === 'loading' };
}
