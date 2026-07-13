import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Heart, Tag, User, Users } from 'lucide-react';
import Markdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth } from '@/lib/auth';
import { getProjectById, getProjectCoAuthors, getProjectSupportRequests, requestSupport, respondToSupportRequest } from '@/lib/actions/projects';
import { toggleLike } from '@/lib/actions/likes';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await getProjectById(id);

  const isOwner = !!session?.user && session.user.id === project?.authorId;
  const isAdmin = session?.user?.role === 'admin';

  if (!project || (project.status !== 'approved' && !isOwner && !isAdmin)) {
    notFound();
  }

  const coAuthors = await getProjectCoAuthors(id);
  const supportRequests = isOwner || isAdmin ? await getProjectSupportRequests(id) : [];
  const approvedSupportCount = supportRequests.filter((r) => r.status === 'approved').length;
  const alreadyRequested = supportRequests.some((r) => r.userId === session?.user?.id);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
          </Link>

          {project.status !== 'approved' && (
            <div className="badge badge-warning">Pendiente de aprobación — solo visible para ti y administradores</div>
          )}

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(project.tags || []).map((tag) => (
                <span key={tag} className="badge-primary text-xs">{tag}</span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">{project.title}</h1>

            <div className="flex flex-wrap gap-8 py-6 border-y border-border">
              <Link href={`/profile/${project.authorId}`} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-text-muted" />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide">Investigador líder</div>
                  <div className="text-sm font-medium text-text-primary">{project.authorName}</div>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-text-muted" />
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide">Publicado</div>
                  <div className="text-sm text-text-primary">{project.createdAt.toLocaleDateString('es-PE')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-text-muted" />
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide">Impacto SOCEISI</div>
                  <div className="text-sm text-text-primary">{project.impactScore}</div>
                </div>
              </div>
            </div>
          </div>

          {project.image && (
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image src={project.image} alt={project.title} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="card p-8 prose prose-invert max-w-none">
                <Markdown>{project.content || project.description}</Markdown>
              </div>

              {coAuthors.length > 0 && (
                <div className="card p-8">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Coautores</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {coAuthors.map((ca) => (
                      <Link key={ca.id} href={`/profile/${ca.userId}`} className="flex items-center gap-3 p-3 bg-surface-muted rounded-lg hover:bg-surface-hover transition-colors">
                        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                          <User className="w-4 h-4 text-text-muted" />
                        </div>
                        <span className="text-sm font-medium text-text-primary">{ca.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {(isOwner || isAdmin) && (
                <div className="card p-8">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">Solicitudes de apoyo</h3>
                  <p className="text-sm text-text-muted mb-4">{approvedSupportCount} / {project.supportSlots} cupos ocupados</p>
                  <div className="space-y-3">
                    {supportRequests.length === 0 && <p className="text-sm text-text-muted">Sin solicitudes todavía.</p>}
                    {supportRequests.map((r) => (
                      <div key={r.id} className="flex items-center justify-between gap-4 p-3 bg-surface-muted rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-text-primary">{r.userName}</div>
                          {r.message && <div className="text-xs text-text-muted">{r.message}</div>}
                        </div>
                        {r.status === 'pending' ? (
                          <div className="flex gap-2">
                            <form action={async () => { 'use server'; await respondToSupportRequest(r.id, true); }}>
                              <button type="submit" className="text-xs font-medium text-emerald-500 hover:text-emerald-600">Aprobar</button>
                            </form>
                            <form action={async () => { 'use server'; await respondToSupportRequest(r.id, false); }}>
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
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Interactuar</h3>
                {session?.user && (
                  <form action={async () => { 'use server'; await toggleLike('project', project.id); }}>
                    <button type="submit" className="btn-secondary w-full flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4" /> {project.likes} likes
                    </button>
                  </form>
                )}
                {session?.user && !isOwner && project.supportSlots > 0 && (
                  alreadyRequested ? (
                    <p className="text-xs text-text-muted text-center">Ya enviaste una solicitud de apoyo.</p>
                  ) : (
                    <form action={async () => { 'use server'; await requestSupport(project.id, {}); }}>
                      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" /> Solicitar apoyo
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
