import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, User, Users } from 'lucide-react';
import { auth } from '@/lib/auth';
import {
  getMentorshipRequestById,
  getMentorshipCategoriesFor,
  getMentorshipParticipants,
  joinOpenMentorship,
  finishOpenMentorship,
  completeRequestMentorship,
  cancelRequestMentorship,
} from '@/lib/actions/mentorship';

export default async function MentorshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const request = await getMentorshipRequestById(id);

  const isOwner = !!session?.user && session.user.id === request?.studentId;
  const isAdmin = session?.user?.role === 'admin';

  if (!request || (request.approvalStatus !== 'approved' && !isOwner && !isAdmin)) {
    notFound();
  }

  const categories = await getMentorshipCategoriesFor(id);
  const participants = request.kind === 'open' ? await getMentorshipParticipants(id) : [];
  const isParticipant = participants.some((p) => p.userId === session?.user?.id);
  const mentees = participants.filter((p) => p.role === 'mentee');

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          <Link href="/mentorship" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver a Mentorías
          </Link>

          {request.approvalStatus !== 'approved' && (
            <div className="badge badge-warning">Pendiente de aprobación</div>
          )}

          <div>
            <span className="badge-primary text-xs mb-4 inline-block">{request.kind === 'open' ? 'Mentoría abierta' : 'Solicitud de ayuda'}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{request.topic}</h1>
            <p className="text-text-secondary leading-relaxed mb-4">{request.description}</p>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => <span key={c.id} className="badge text-xs">{c.name}</span>)}
              </div>
            )}
          </div>

          {request.syllabusUrl && (
            <a href={request.syllabusUrl} className="btn-secondary inline-flex items-center gap-2 w-fit">
              <Download className="w-4 h-4" /> Descargar temario
            </a>
          )}

          {request.kind === 'open' ? (
            <div className="card p-8 space-y-6">
              <h3 className="text-lg font-semibold text-text-primary">Participantes ({mentees.length})</h3>
              <div className="space-y-3">
                {mentees.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-4 p-3 bg-surface-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-primary">{m.userName}</span>
                    </div>
                    {m.evaluationScore != null ? (
                      <span className="badge badge-success">{m.evaluationScore} pts</span>
                    ) : isOwner && request.status !== 'completed' ? (
                      <input type="text" form="finish-form" name={`score-${m.userId}`} placeholder="pts" className="input w-20 text-sm" />
                    ) : (
                      <span className="text-xs text-text-muted">Sin evaluar</span>
                    )}
                  </div>
                ))}
                {mentees.length === 0 && <p className="text-sm text-text-muted">Nadie se ha unido todavía.</p>}
              </div>

              {isOwner && request.status !== 'completed' && mentees.length > 0 && (
                <form
                  id="finish-form"
                  action={async (formData: FormData) => {
                    'use server';
                    const evaluations = mentees
                      .map((m) => ({ userId: m.userId, score: Number(formData.get(`score-${m.userId}`)) }))
                      .filter((e) => !Number.isNaN(e.score) && formData.get(`score-${e.userId}`) !== '');
                    await finishOpenMentorship(id, { evaluations });
                  }}
                >
                  <button type="submit" className="btn-primary w-full">Finalizar y evaluar</button>
                </form>
              )}

              {session?.user && !isOwner && !isParticipant && request.status !== 'completed' && (
                <form action={async () => { 'use server'; await joinOpenMentorship(id); }}>
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" /> Unirme a esta mentoría
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="card p-8 space-y-4">
              <div className="text-sm text-text-muted">Estado: <span className="text-text-primary font-medium">{request.status}</span></div>
              {isOwner && request.status !== 'completed' && request.status !== 'cancelled' && (
                <div className="space-y-4">
                  <form
                    action={async (formData: FormData) => {
                      'use server';
                      const rating = Number(formData.get('rating'));
                      const ratingComment = String(formData.get('ratingComment') || '');
                      await completeRequestMentorship(id, { rating, ratingComment });
                    }}
                    className="space-y-3"
                  >
                    <label className="text-sm font-medium text-text-primary block">Calificar mentor (1-5) y marcar completada</label>
                    <input name="rating" type="number" min={1} max={5} required className="input w-24" />
                    <textarea name="ratingComment" rows={2} className="input w-full resize-none" placeholder="Comentario (opcional)" />
                    <button type="submit" className="btn-primary">Marcar completada</button>
                  </form>
                  <form action={async () => { 'use server'; await cancelRequestMentorship(id); }}>
                    <button type="submit" className="btn-secondary">Cancelar solicitud</button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
  );
}
