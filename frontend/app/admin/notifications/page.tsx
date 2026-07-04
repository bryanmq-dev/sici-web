import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { markContactMessageAsRead, deleteContactMessage } from '@/lib/actions/notifications';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  const allMessages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Mensajes de Contacto</h1>
        <p className="text-text-secondary">{allMessages.length} mensajes recibidos</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Asunto</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Mensaje</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Leído</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allMessages.map(msg => (
                <tr key={msg.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{msg.name}</td>
                  <td className="p-4 text-sm text-text-secondary">{msg.email}</td>
                  <td className="p-4 text-sm text-text-secondary">{msg.subject || 'N/A'}</td>
                  <td className="p-4 text-sm text-text-secondary max-w-xs truncate">{msg.message}</td>
                  <td className="p-4">
                    <span className={`badge ${msg.isRead ? 'badge-success' : 'badge-warning'}`}>
                      {msg.isRead ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    {!msg.isRead && (
                      <form action={async () => { 'use server'; await markContactMessageAsRead(msg.id); }}>
                        <button type="submit" className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
                          Marcar leído
                        </button>
                      </form>
                    )}
                    <form action={async () => { 'use server'; await deleteContactMessage(msg.id); }}>
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
