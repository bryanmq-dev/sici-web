import { getMentorshipRequestsForAdmin, approveMentorship, rejectMentorship, deleteMentorshipRequest, updateMentorshipRequest } from '@/lib/actions/mentorship';

export const dynamic = 'force-dynamic';

export default async function AdminMentorshipPage() {
  const allRequests = await getMentorshipRequestsForAdmin();
  const pending = allRequests.filter((r) => r.approvalStatus === 'pending');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Mentorías</h1>
        <p className="text-text-secondary">{allRequests.length} solicitudes, {pending.length} pendientes</p>
      </div>

      {pending.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-muted">
            <h2 className="text-sm font-semibold text-text-primary">Pendientes de aprobación</h2>
          </div>
          <div className="divide-y divide-border">
            {pending.map((req) => (
              <div key={req.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-text-primary">{req.topic}</div>
                  <div className="text-xs text-text-muted">{req.studentName || 'N/A'} · {req.kind === 'open' ? 'abierta' : 'solicitud'}</div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <form action={async () => { 'use server'; await approveMentorship(req.id); }}>
                    <button type="submit" className="text-xs font-medium text-emerald-500 hover:text-emerald-600">Aprobar</button>
                  </form>
                  <form action={async () => { 'use server'; await rejectMentorship(req.id); }}>
                    <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600">Rechazar</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Tema</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Estudiante</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Fecha</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allRequests.map(req => (
                <tr key={req.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{req.topic}</td>
                  <td className="p-4 text-sm text-text-secondary">{req.studentName || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`badge ${
                      req.status === 'accepted' ? 'badge-primary' :
                      req.status === 'completed' ? 'badge-success' :
                      'badge-warning'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-text-muted">{req.createdAt.toLocaleDateString()}</td>
                  <td className="p-4 flex gap-3">
                    <form action={async () => { 'use server'; await updateMentorshipRequest(req.id, { status: 'accepted' }); }}>
                      <button type="submit" className="text-xs font-medium text-emerald-500 hover:text-emerald-600 transition-colors">
                        Aceptar
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await deleteMentorshipRequest(req.id); }}>
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
