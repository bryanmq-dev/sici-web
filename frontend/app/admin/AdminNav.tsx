'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, FolderOpen, FileText, Calendar, Rocket, BookOpen, MessageSquare, GraduationCap, Award, Building2, Bell } from 'lucide-react';

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/admin/users', icon: Users },
  { name: 'Proyectos', href: '/admin/projects', icon: FolderOpen },
  { name: 'Artículos', href: '/admin/articles', icon: FileText },
  { name: 'Eventos', href: '/admin/events', icon: Calendar },
  { name: 'Incubadora', href: '/admin/incubator', icon: Rocket },
  { name: 'Cursos', href: '/admin/courses', icon: BookOpen },
  { name: 'Foro', href: '/admin/forum', icon: MessageSquare },
  { name: 'Mentorías', href: '/admin/mentorship', icon: GraduationCap },
  { name: 'Gamificación', href: '/admin/gamification', icon: Award },
  { name: 'Organización', href: '/admin/organization', icon: Building2 },
  { name: 'Notificaciones', href: '/admin/notifications', icon: Bell },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
      {adminNav.map(item => {
        const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-primary/5 text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
