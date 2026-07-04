import { db } from '@/db';
import { joinApplications } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { updateJoinApplicationStatus, deleteJoinApplication } from '@/lib/actions/notifications';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const allApplications = await db.select().from(joinApplications).orderBy(desc(joinApplications.createdAt));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Solicitudes de Ingreso</h1>
        <p className="text-text-secondary">{allApplications.length} solicitudes recibidas</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Semestre</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Área</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allApplications.map(app => (
                <tr key={app.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{app.fullName}</td>
                  <td className="p-4 text-sm text-text-secondary">{app.email}</td>
                  <td className="p-4 text-sm text-text-secondary">{app.semester}°</td>
                  <td className="p-4 text-sm text-text-secondary">{app.interestArea}</td>
                  <td className="p-4">
                    <span className={`badge ${
                      app.status === 'approved' ? 'badge-success' :
                      app.status === 'rejected' ? 'badge-error' :
                      'badge-warning'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <form action={async () => { 'use server'; await updateJoinApplicationStatus(app.id, 'approved'); }}>
                      <button type="submit" className="text-xs font-medium text-emerald-500 hover:text-emerald-600 transition-colors">
                        Aprobar
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await updateJoinApplicationStatus(app.id, 'rejected'); }}>
                      <button type="submit" className="text-xs font-medium text-amber-500 hover:text-amber-600 transition-colors">
                        Rechazar
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await deleteJoinApplication(app.id); }}>
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
