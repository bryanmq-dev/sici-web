'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, FolderOpen, FileText, Calendar, Rocket,
  BookOpen, MessageSquare, GraduationCap, Award, Building2, Bell, LogOut, Menu, X
} from 'lucide-react';

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

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass border border-primary/20 rounded-sm text-primary"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú de administración"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-surface-container-low border-r border-primary/10 flex flex-col z-40 transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-5 border-b border-primary/10 flex items-center justify-between">
          <div>
            <h1 className="text-base font-display font-bold text-primary tracking-tight normal-case">SICI Admin</h1>
            <p className="text-[10px] text-secondary/50 mt-0.5">Panel de control</p>
          </div>
          <button
            className="lg:hidden p-1 text-secondary hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-grow p-3 space-y-0.5 overflow-y-auto">
          {adminNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-md',
                pathname === item.href
                  ? 'text-primary bg-primary/10 border-l-2 border-primary pl-[10px]'
                  : 'text-secondary hover:text-on-surface hover:bg-primary/5'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-primary/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-secondary hover:text-on-surface hover:bg-primary/5 transition-all rounded-md"
          >
            <LogOut className="w-4 h-4" />
            Volver al sitio
          </Link>
        </div>
      </aside>
    </>
  );
}
