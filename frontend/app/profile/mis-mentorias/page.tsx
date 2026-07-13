import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileSidebar from '@/components/ProfileSidebar';
import { auth } from '@/lib/auth';
import { getMyMentorships, getMyMentoringRequests } from '@/lib/actions/mentorship';

export default async function MisMentoriasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [myMentorships, mentoringRequests] = await Promise.all([
    getMyMentorships(session.user.id),
    getMyMentoringRequests(session.user.id),
  ]);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1"><ProfileSidebar /></div>
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-2xl font-bold text-text-primary">Mis Mentorías</h1>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Mentorías que abrí / solicité</h3>
              <div className="space-y-2">
                {myMentorships.map((m) => (
                  <Link key={m.id} href={`/mentorship/${m.id}`} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg hover:bg-surface-hover transition-colors">
                    <div>
                      <span className="text-sm text-text-primary">{m.topic}</span>
                      <span className="text-xs text-text-muted ml-2">({m.kind === 'open' ? 'abierta' : 'solicitud'})</span>
                    </div>
                    <span className="badge text-xs">{m.status}</span>
                  </Link>
                ))}
                {myMentorships.length === 0 && <p className="text-sm text-text-muted">No has abierto ni solicitado ninguna mentoría.</p>}
              </div>
            </div>

            {mentoringRequests.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Solicitudes que recibiste como mentor</h3>
                <div className="space-y-2">
                  {mentoringRequests.map((r) => (
                    <Link key={r.id} href={`/mentorship/${r.id}`} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg hover:bg-surface-hover transition-colors">
                      <div>
                        <span className="text-sm text-text-primary">{r.topic}</span>
                        <span className="text-xs text-text-muted ml-2">de {r.studentName}</span>
                      </div>
                      <span className="badge text-xs">{r.status}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
