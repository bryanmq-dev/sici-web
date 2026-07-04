'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, FolderOpen, GraduationCap, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Perfil', href: '/profile', icon: User },
  { name: 'Mis Proyectos', href: '/profile/mis-proyectos', icon: FolderOpen },
  { name: 'Mis Mentorías', href: '/profile/mis-mentorias', icon: GraduationCap },
  { name: 'Mi Incubadora', href: '/profile/mi-incubadora', icon: Rocket },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 mb-8 lg:mb-0">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
            pathname === item.href
              ? 'bg-primary/5 text-primary'
              : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
          )}
        >
          <item.icon className="w-4 h-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
