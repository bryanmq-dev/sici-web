'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors rounded-lg w-full"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </button>
  );
}
