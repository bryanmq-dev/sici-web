import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProfileSidebar from '@/components/ProfileSidebar';
import { auth } from '@/lib/auth';
import { getMyProjects, getMySupportRequestsSent } from '@/lib/actions/projects';

export default async function MisProyectosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [myProjects, supportRequestsSent] = await Promise.all([
    getMyProjects(session.user.id),
    getMySupportRequestsSent(session.user.id),
  ]);

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1"><ProfileSidebar /></div>
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-2xl font-bold text-text-primary">Mis Proyectos</h1>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Proyectos que lidero</h3>
              <div className="space-y-2">
                {myProjects.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg hover:bg-surface-hover transition-colors">
                    <span className="text-sm text-text-primary">{p.title}</span>
                    <span className="badge text-xs">{p.status}</span>
                  </Link>
                ))}
                {myProjects.length === 0 && <p className="text-sm text-text-muted">Aún no has postulado ningún proyecto.</p>}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Solicitudes de apoyo enviadas</h3>
              <div className="space-y-2">
                {supportRequestsSent.map((r) => (
                  <Link key={r.id} href={`/projects/${r.projectId}`} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg hover:bg-surface-hover transition-colors">
                    <span className="text-sm text-text-primary">{r.projectTitle}</span>
                    <span className="badge text-xs">{r.status}</span>
                  </Link>
                ))}
                {supportRequestsSent.length === 0 && <p className="text-sm text-text-muted">No has solicitado apoyar ningún proyecto.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
