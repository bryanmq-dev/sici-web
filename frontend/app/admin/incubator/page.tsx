import { getIncubatorProjectsForAdmin, approveIncubatorProject, rejectIncubatorProject, deleteIncubatorProject, getSuggestionsForAdmin } from '@/lib/actions/incubator';

export const dynamic = 'force-dynamic';

export default async function AdminIncubatorPage() {
  const [allProjects, suggestions] = await Promise.all([getIncubatorProjectsForAdmin(), getSuggestionsForAdmin()]);
  const pending = allProjects.filter((p) => p.approvalStatus === 'pending');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Incubadora</h1>
        <p className="text-text-secondary">{allProjects.length} proyectos, {pending.length} pendientes</p>
      </div>

      {pending.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-muted">
            <h2 className="text-sm font-semibold text-text-primary">Pendientes de aprobación</h2>
          </div>
          <div className="divide-y divide-border">
            {pending.map((project) => (
              <div key={project.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-text-primary">{project.title}</div>
                  <div className="text-xs text-text-muted">{project.authorName || 'N/A'}</div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <form action={async () => { 'use server'; await approveIncubatorProject(project.id); }}>
                    <button type="submit" className="text-xs font-medium text-emerald-500 hover:text-emerald-600">Aprobar</button>
                  </form>
                  <form action={async () => { 'use server'; await rejectIncubatorProject(project.id); }}>
                    <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600">Rechazar</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-muted">
            <h2 className="text-sm font-semibold text-text-primary">Sugerencias de proyectos</h2>
          </div>
          <div className="divide-y divide-border">
            {suggestions.map((s) => (
              <div key={s.id} className="p-4">
                <div className="text-sm font-medium text-text-primary">{s.title}</div>
                <div className="text-xs text-text-muted">{s.description}</div>
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
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Título</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Autor</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Etapa</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Aprobación</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allProjects.map(project => (
                <tr key={project.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{project.title}</td>
                  <td className="p-4 text-sm text-text-secondary">{project.authorName || 'N/A'}</td>
                  <td className="p-4 text-sm text-text-secondary">{project.status}</td>
                  <td className="p-4">
                    <span className={`badge ${project.approvalStatus === 'approved' ? 'badge-success' : project.approvalStatus === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                      {project.approvalStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <form action={async () => { 'use server'; await deleteIncubatorProject(project.id); }}>
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
