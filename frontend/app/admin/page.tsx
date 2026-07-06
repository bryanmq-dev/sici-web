import { db } from '@/db';
import { users, projects, articles, events, forumQuestions, courses, mentorshipRequests, contactMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { FolderOpen, FileText, Calendar, MessageSquare, BookOpen, GraduationCap, Users, Mail, UserPlus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    userCount,
    projectCount,
    articleCount,
    eventCount,
    forumCount,
    courseCount,
    mentorshipCount,
    pendingRegistrationCount,
    messageCount,
  ] = await Promise.all([
    db.select().from(users).then(r => r.length),
    db.select().from(projects).then(r => r.length),
    db.select().from(articles).then(r => r.length),
    db.select().from(events).then(r => r.length),
    db.select().from(forumQuestions).then(r => r.length),
    db.select().from(courses).then(r => r.length),
    db.select().from(mentorshipRequests).then(r => r.length),
    db.select().from(users).where(eq(users.status, 'postulacion')).then(r => r.length),
    db.select().from(contactMessages).then(r => r.length),
  ]);

  const stats = [
    { label: 'Usuarios', value: userCount, icon: Users, href: '/admin/users', color: 'text-primary' },
    { label: 'Proyectos', value: projectCount, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-500' },
    { label: 'Artículos', value: articleCount, icon: FileText, href: '/admin/articles', color: 'text-green-500' },
    { label: 'Eventos', value: eventCount, icon: Calendar, href: '/admin/events', color: 'text-purple-500' },
    { label: 'Forum', value: forumCount, icon: MessageSquare, href: '/admin/forum', color: 'text-amber-500' },
    { label: 'Cursos', value: courseCount, icon: BookOpen, href: '/admin/courses', color: 'text-cyan-500' },
    { label: 'Mentorías', value: mentorshipCount, icon: GraduationCap, href: '/admin/mentorship', color: 'text-pink-500' },
    { label: 'Postulaciones pendientes', value: pendingRegistrationCount, icon: UserPlus, href: '/admin/users', color: 'text-orange-500' },
    { label: 'Mensajes', value: messageCount, icon: Mail, href: '/admin/notifications', color: 'text-emerald-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard Admin</h1>
        <p className="text-text-secondary">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card p-6 group hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-surface-muted flex items-center justify-center group-hover:bg-primary/5 transition-colors`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-sm text-text-muted mb-1">{stat.label}</div>
                <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
