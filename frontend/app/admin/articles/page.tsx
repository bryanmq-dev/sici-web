import { getArticlesForAdmin, approveArticle, rejectArticle, deleteArticle } from '@/lib/actions/articles';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const allArticles = await getArticlesForAdmin();
  const pending = allArticles.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Artículos</h1>
        <p className="text-text-secondary">{allArticles.length} artículos registrados, {pending.length} pendientes</p>
      </div>

      {pending.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-muted">
            <h2 className="text-sm font-semibold text-text-primary">Pendientes de aprobación</h2>
          </div>
          <div className="divide-y divide-border">
            {pending.map((article) => (
              <div key={article.id} className="p-4 flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-text-primary">{article.title}</div>
                <div className="flex gap-3 shrink-0">
                  <form action={async () => { 'use server'; await approveArticle(article.id); }}>
                    <button type="submit" className="text-xs font-medium text-emerald-500 hover:text-emerald-600">Aprobar</button>
                  </form>
                  <form action={async () => { 'use server'; await rejectArticle(article.id); }}>
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
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Título</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Área</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Likes</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Fecha</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allArticles.map(article => (
                <tr key={article.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{article.title}</td>
                  <td className="p-4 text-sm text-text-secondary">{article.researchArea || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`badge ${article.status === 'approved' ? 'badge-success' : article.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-primary font-mono">{article.likes}</td>
                  <td className="p-4 text-xs text-text-muted">{article.createdAt.toLocaleDateString()}</td>
                  <td className="p-4">
                    <form action={async () => { 'use server'; await deleteArticle(article.id); }}>
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
