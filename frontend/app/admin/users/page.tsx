import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { setUserRole, deleteUser } from '@/lib/actions/users';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Usuarios</h1>
        <p className="text-text-secondary">{allUsers.length} usuarios registrados</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Rol</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">isipoints</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Registro</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map(user => (
                <tr key={user.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{user.name}</td>
                  <td className="p-4 text-sm text-text-secondary">{user.email}</td>
                  <td className="p-4">
                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                      {user.role}
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
