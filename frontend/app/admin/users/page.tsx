import { db } from '@/db';
import { users } from '@/db/schema';
import { desc, ne } from 'drizzle-orm';
import { setUserRole, deleteUser } from '@/lib/actions/users';
import { getPendingRegistrations, approveRegistration, rejectRegistration } from '@/lib/actions/notifications';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const [pending, activeUsers] = await Promise.all([
    getPendingRegistrations(),
    db.select().from(users).where(ne(users.status, 'postulacion')).orderBy(desc(users.createdAt)),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Usuarios</h1>
        <p className="text-text-secondary">{activeUsers.length} usuarios, {pending.length} postulaciones pendientes</p>
      </div>

      {pending.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-muted">
            <h2 className="text-sm font-semibold text-text-primary">Postulaciones pendientes</h2>
          </div>
          <div className="divide-y divide-border">
            {pending.map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-sm text-text-primary font-medium">{user.name}</span>
                    <span className="text-xs text-text-muted ml-2">{user.email}</span>
                    <span className="text-xs text-text-muted ml-2">Semestre {user.semester} · {user.interestArea}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <form action={async () => { 'use server'; await approveRegistration(user.id); }}>
                      <button type="submit" className="text-xs font-medium text-primary hover:underline">
                        Aprobar
                      </button>
                    </form>
                    <details className="relative">
                      <summary className="text-xs font-medium text-red-500 hover:text-red-600 cursor-pointer list-none">
                        Rechazar
                      </summary>
                      <form
                        action={async (formData: FormData) => {
                          'use server';
                          await rejectRegistration({ userId: user.id, reason: String(formData.get('reason') || '') });
                        }}
                        className="mt-2 flex gap-2"
                      >
                        <input name="reason" required placeholder="Motivo del rechazo" className="input text-xs py-1" />
                        <button type="submit" className="btn-secondary text-xs px-3 py-1 shrink-0">Confirmar</button>
                      </form>
                    </details>
                  </div>
                </div>
                {user.motivation && (
                  <p className="text-xs text-text-muted mt-2 max-w-2xl">{user.motivation}</p>
                )}
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
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Rol</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Estado</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">isipoints</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Registro</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map(user => (
                <tr key={user.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{user.name}</td>
                  <td className="p-4 text-sm text-text-secondary">{user.email}</td>
                  <td className="p-4">
                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${user.status === 'activo' ? 'badge-success' : 'badge-error'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-primary font-mono">{user.isiPoints}</td>
                  <td className="p-4 text-xs text-text-muted">{user.createdAt.toLocaleDateString()}</td>
                  <td className="p-4 flex gap-3">
                    <form action={async () => { 'use server'; await setUserRole(user.id, { role: user.role === 'admin' ? 'student' : 'admin' }); }}>
                      <button type="submit" className="text-xs font-medium text-primary hover:underline">
                        {user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await deleteUser(user.id); }}>
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
