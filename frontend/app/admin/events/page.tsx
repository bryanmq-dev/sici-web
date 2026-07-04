import Link from 'next/link';
import { db } from '@/db';
import { events } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { deleteEvent, createEvent, addImpactGalleryImage } from '@/lib/actions/events';
import { uploadImage } from '@/lib/actions/uploads';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const allEvents = await db.select().from(events).orderBy(desc(events.eventDate));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Eventos</h1>
        <p className="text-text-secondary">{allEvents.length} eventos registrados</p>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Nuevo evento</h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            const appliesToScore = formData.get('appliesToScore') === 'on';
            await createEvent({
              title: String(formData.get('title')),
              description: String(formData.get('description')),
              eventDate: new Date(String(formData.get('eventDate'))),
              eventType: String(formData.get('eventType')),
              location: String(formData.get('location') || '') || undefined,
              appliesToScore,
              scoreDescription: appliesToScore ? String(formData.get('scoreDescription') || '') || undefined : undefined,
              scorePoints: appliesToScore && formData.get('scorePoints') ? Number(formData.get('scorePoints')) : undefined,
            });
          }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <input name="title" required placeholder="Título" className="input" />
          <input name="eventType" required placeholder="Área (social/epc/investigación...)" className="input" />
          <input name="eventDate" type="datetime-local" required className="input" />
          <input name="location" placeholder="Lugar" className="input" />
          <textarea name="description" required placeholder="Descripción" rows={3} className="input sm:col-span-2 resize-none" />
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input name="appliesToScore" type="checkbox" className="w-4 h-4" /> Aplica a puntaje
          </label>
          <input name="scorePoints" type="number" placeholder="Puntos a otorgar" className="input" />
          <input name="scoreDescription" placeholder="Descripción del logro (ej. Ganar 1er lugar)" className="input sm:col-span-2" />
          <button type="submit" className="btn-primary sm:col-span-2">Crear evento</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Subir foto a Archivos de Impacto</h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            const file = formData.get('file');
            if (!(file instanceof File) || file.size === 0) return;
            const uploadForm = new FormData();
            uploadForm.set('file', file);
            const { url } = await uploadImage(uploadForm);
            await addImpactGalleryImage(url, { caption: String(formData.get('caption') || '') || undefined });
          }}
          className="flex gap-4 items-end"
        >
          <input name="file" type="file" accept="image/*" required className="input flex-grow" />
          <input name="caption" placeholder="Descripción (opcional)" className="input flex-grow" />
          <button type="submit" className="btn-primary shrink-0">Subir</button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Título</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Tipo</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Fecha</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allEvents.map(event => (
                <tr key={event.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{event.title}</td>
                  <td className="p-4 text-sm text-text-secondary">{event.eventType}</td>
                  <td className="p-4 text-xs text-text-muted">{event.eventDate.toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`badge ${event.status === 'upcoming' ? 'badge-primary' : 'badge-secondary'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <Link href={`/events/${event.id}`} className="text-xs font-medium text-primary hover:underline">
                      Evaluar participantes
                    </Link>
                    <form action={async () => { 'use server'; await deleteEvent(event.id); }}>
                      <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
