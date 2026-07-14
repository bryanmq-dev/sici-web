import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, User, Users } from 'lucide-react';
import Markdown from 'react-markdown';
import AddTeamMembersForm from '@/components/AddTeamMembersForm';
import { auth } from '@/lib/auth';
import {
  getIncubatorProjectById,
  getIncubatorTeamMembers,
  getIncubatorJoinRequests,
  getAvailableUsersForTeam,
  requestToJoin,
  respondToJoinRequest,
} from '@/lib/actions/incubator';

export default async function IncubatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await getIncubatorProjectById(id);

  const isOwner = !!session?.user && session.user.id === project?.authorId;
  const isAdmin = session?.user?.role === 'admin';

  if (!project || (project.approvalStatus !== 'approved' && !isOwner && !isAdmin)) {
    notFound();
  }

  const team = await getIncubatorTeamMembers(id);
  const joinRequests = isOwner || isAdmin ? await getIncubatorJoinRequests(id) : [];
  const availableUsers = isOwner || isAdmin ? await getAvailableUsersForTeam(id) : [];
  const isMember = team.some((m) => m.userId === session?.user?.id);
  const alreadyRequested = joinRequests.some((r) => r.userId === session?.user?.id);

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <Link href="/incubator" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver a Incubadora
          </Link>

          {project.approvalStatus !== 'approved' && (
            <div className="badge badge-warning">Pendiente de aprobación — solo visible para ti y administradores</div>
          )}

          <div>
            <span className="badge-primary text-xs mb-4 inline-block">{project.status}</span>
            <h1 className="text-4xl font-bold text-text-primary mb-4">{project.title}</h1>
            <p className="text-text-secondary">{project.description}</p>
          </div>

          {project.image && (
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image src={project.image} alt={project.title} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {project.content && (
                <div className="card p-8 prose prose-invert max-w-none">
                  <Markdown>{project.content}</Markdown>
                </div>
              )}

              <div className="card p-8">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Equipo</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {team.map((m) => (
                    <Link key={m.id} href={`/profile/${m.userId}`} className="flex items-center gap-3 p-3 bg-surface-muted rounded-lg hover:bg-surface-hover transition-colors">
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                        <User className="w-4 h-4 text-text-muted" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">{m.name}</div>
                        <div className="text-xs text-text-muted uppercase">{m.role}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {(isOwner || isAdmin) && (
                  <AddTeamMembersForm projectId={id} availableUsers={availableUsers} />
                )}
              </div>

              {(isOwner || isAdmin) && (
                <div className="card p-8">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Solicitudes para unirse</h3>
                  <div className="space-y-3">
                    {joinRequests.length === 0 && <p className="text-sm text-text-muted">Sin solicitudes todavía.</p>}
                    {joinRequests.map((r) => (
                      <div key={r.id} className="flex items-center justify-between gap-4 p-3 bg-surface-muted rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-text-primary">{r.userName}</div>
                          {r.message && <div className="text-xs text-text-muted">{r.message}</div>}
                        </div>
                        {r.status === 'pending' ? (
                          <div className="flex gap-2">
                            <form action={async () => { 'use server'; await respondToJoinRequest(r.id, true); }}>
                              <button type="submit" className="text-xs font-medium text-emerald-500 hover:text-emerald-600">Aprobar</button>
                            </form>
                            <form action={async () => { 'use server'; await respondToJoinRequest(r.id, false); }}>
                              <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600">Rechazar</button>
                            </form>
                          </div>
                        ) : (
                          <span className={`badge ${r.status === 'approved' ? 'badge-success' : 'badge-error'}`}>{r.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).map((t) => (
                    <span key={t} className="badge text-xs">{t}</span>
                  ))}
                </div>
                {project.client && (
                  <div>
                    <div className="text-xs text-text-muted uppercase">Cliente</div>
                    <div className="text-sm text-text-primary">{project.client}</div>
                  </div>
                )}
              </div>

              {session?.user && !isOwner && !isMember && (
                alreadyRequested ? (
                  <p className="text-xs text-text-muted text-center">Ya enviaste una solicitud para unirte.</p>
                ) : (
                  <form action={async () => { 'use server'; await requestToJoin(id, {}); }}>
                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" /> Solicitar unirse
                    </button>
                  </form>
                )
              )}
              {!session?.user && (
                <Link href="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                  Inicia sesión para participar
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
  );
}
