import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProfileSidebar from '@/components/ProfileSidebar';
import { auth } from '@/lib/auth';
import { getMyIncubatorProjects, getMyIncubatorMemberships } from '@/lib/actions/incubator';

export default async function MiIncubadoraPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [myProjects, myMemberships] = await Promise.all([
    getMyIncubatorProjects(session.user.id),
    getMyIncubatorMemberships(session.user.id),
  ]);

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1"><ProfileSidebar /></div>
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-2xl font-bold text-text-primary">Mi Incubadora</h1>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Proyectos que administro</h3>
              <div className="space-y-2">
                {myProjects.map((p) => (
                  <Link key={p.id} href={`/incubator/${p.id}`} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg hover:bg-surface-hover transition-colors">
                    <span className="text-sm text-text-primary">{p.title}</span>
                    <span className="badge text-xs">{p.approvalStatus}</span>
                  </Link>
                ))}
                {myProjects.length === 0 && <p className="text-sm text-text-muted">Aún no propusiste ningún proyecto de incubadora.</p>}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Equipos a los que pertenezco</h3>
              <div className="space-y-2">
                {myMemberships.map((m) => (
                  <Link key={m.id} href={`/incubator/${m.incubatorProjectId}`} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg hover:bg-surface-hover transition-colors">
                    <div>
                      <span className="text-sm text-text-primary">{m.projectTitle}</span>
                      <span className="text-xs text-text-muted ml-2">({m.role})</span>
                    </div>
                    {m.finalScore != null && <span className="badge badge-success text-xs">{m.finalScore} pts</span>}
                  </Link>
                ))}
                {myMemberships.length === 0 && <p className="text-sm text-text-muted">No perteneces a ningún equipo todavía.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
