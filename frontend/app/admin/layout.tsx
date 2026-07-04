import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, FolderOpen, FileText, Calendar, Rocket, BookOpen, MessageSquare, GraduationCap, Award, Building2, Bell, LogOut } from 'lucide-react';

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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'admin') redirect('/');

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col fixed h-full">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-text-primary">SICI Admin</h1>
          <p className="text-xs text-text-muted mt-1">Panel de Control</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {adminNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors rounded-lg"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors rounded-lg">
            <LogOut className="w-4 h-4" />
            Volver al Sitio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
