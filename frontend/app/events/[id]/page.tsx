import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Handshake, HeartHandshake, MapPin, CalendarCheck, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth } from '@/lib/auth';
import { getEventById, getEventParticipants, getEventAttendeeCount, requestEventParticipation, evaluateEventParticipant } from '@/lib/actions/events';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const event = await getEventById(id);
  if (!event) notFound();

  const isAdmin = session?.user?.role === 'admin';
  const allParticipants = session?.user ? await getEventParticipants(id) : [];
  const participants = isAdmin ? allParticipants : [];
  const myIntents = !isAdmin && session?.user
    ? allParticipants.filter((p) => p.userId === session.user.id).map((p) => p.intent)
    : [];
  const attendeeCount = await getEventAttendeeCount(id);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver a Eventos
          </Link>

          {event.image && (
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image src={event.image} alt={event.title} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          )}

          <div>
            <span className="badge-primary text-xs mb-4 inline-block">{event.eventType}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm text-text-muted mb-6">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {event.eventDate.toLocaleString('es-PE')}</div>
              {event.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location}</div>}
              {attendeeCount > 0 && (
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {attendeeCount} {attendeeCount === 1 ? 'persona asistirá' : 'personas asistirán'}</div>
              )}
            </div>
            <p className="text-text-secondary leading-relaxed mb-6">{event.description}</p>

            {session?.user && !isAdmin && (
              myIntents.includes('attend') ? (
                <span className="badge badge-success flex items-center gap-2 w-fit"><CalendarCheck className="w-4 h-4" /> ¡Ya confirmaste tu asistencia!</span>
              ) : (
                <form action={async () => { 'use server'; await requestEventParticipation(id, { intent: 'attend' }); }}>
                  <button type="submit" className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5">
                    <CalendarCheck className="w-4 h-4" /> Asistiré
                  </button>
                </form>
              )
            )}
            {!session?.user && (
              <Link href="/login" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5">
                Inicia sesión para asistir
              </Link>
            )}
          </div>

          {event.appliesToScore && event.scoreDescription && (
            <div className="card p-4 text-sm text-text-secondary">
              <strong className="text-text-primary">Otorga puntos:</strong> {event.scoreDescription} ({event.scorePoints} pts)
            </div>
          )}

          {session?.user && !isAdmin && (
            <div className="card p-6 flex flex-wrap gap-3">
              {myIntents.includes('collaborate') ? (
                <span className="badge badge-success">Ya te anotaste para colaborar</span>
              ) : (
                <form action={async () => { 'use server'; await requestEventParticipation(id, { intent: 'collaborate' }); }}>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Handshake className="w-4 h-4" /> ¿Deseas colaborar?
                  </button>
                </form>
              )}
              {myIntents.includes('support') ? (
                <span className="badge badge-success">Ya te anotaste para apoyar</span>
              ) : (
                <form action={async () => { 'use server'; await requestEventParticipation(id, { intent: 'support' }); }}>
                  <button type="submit" className="btn-secondary flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4" /> Apoyar en actividad
                  </button>
                </form>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Participantes</h3>
              <div className="space-y-3">
                {participants.length === 0 && <p className="text-sm text-text-muted">Nadie se ha anotado todavía.</p>}
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 p-3 bg-surface-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{p.userName}</div>
                      <div className="text-xs text-text-muted">{p.intent === 'collaborate' ? 'Colaborar' : p.intent === 'support' ? 'Apoyo' : 'Asistencia'}</div>
                    </div>
                    {p.evaluationScore != null ? (
                      <span className="badge badge-success">{p.evaluationScore} pts</span>
                    ) : (
                      <form action={async (formData: FormData) => {
                        'use server';
                        const score = Number(formData.get('score'));
                        await evaluateEventParticipant(p.id, { score });
                      }} className="flex items-center gap-2">
                        <input name="score" type="number" min={0} max={100} required className="input w-20 text-sm" placeholder="pts" />
                        <button type="submit" className="text-xs font-medium text-primary hover:underline">Evaluar</button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
