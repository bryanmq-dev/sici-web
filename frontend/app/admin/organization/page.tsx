import { db } from '@/db';
import { users } from '@/db/schema';
import { getSocietyUnits, getSocietyMemberships, createSocietyUnit, deleteSocietyUnit, assignDirectiveRole, removeDirectiveRole } from '@/lib/actions/organization';
import { DIRECTIVE_ROLES } from '@/lib/constants/organization';

export const dynamic = 'force-dynamic';

export default async function AdminOrganizationPage() {
  const [units, memberships, allUsers] = await Promise.all([
    getSocietyUnits(),
    getSocietyMemberships(),
    db.select({ id: users.id, name: users.name }).from(users).orderBy(users.name),
  ]);

  const directivaMembers = memberships.filter((m) => m.unitName === 'Directiva');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Organización</h1>
        <p className="text-text-secondary">{units.length} unidades, {memberships.length} miembros activos</p>
      </div>

      {/* Asignar cargo directivo */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Asignar cargo directivo</h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await assignDirectiveRole({
              userId: String(formData.get('userId')),
              role: formData.get('role') as any,
              gender: (formData.get('gender') as 'M' | 'F') || undefined,
            });
          }}
          className="grid sm:grid-cols-4 gap-4"
        >
          <select name="userId" required className="input">
            {allUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <select name="role" required className="input">
            {DIRECTIVE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select name="gender" className="input">
            <option value="">Género (para título dinámico)</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          <button type="submit" className="btn-primary">Asignar</button>
        </form>
        <p className="text-xs text-text-muted mt-3">Asignar un cargo otorga el rol de administrador. Máximo 2 &quot;Vocal&quot; simultáneos.</p>
      </div>

      {directivaMembers.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-muted">
            <h2 className="text-sm font-semibold text-text-primary">Directiva actual</h2>
          </div>
          <div className="divide-y divide-border">
            {directivaMembers.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-text-primary font-medium">{m.userName}</span>
                  <span className="badge badge-primary text-xs ml-2">{m.role}</span>
                </div>
                <form action={async () => { 'use server'; await removeDirectiveRole(m.id); }}>
                  <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600">Remover cargo</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unidades */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Unidades de la sociedad</h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createSocietyUnit({ name: String(formData.get('name')), description: String(formData.get('description') || '') || undefined });
          }}
          className="flex gap-4 mb-6"
        >
          <input name="name" required placeholder="Nombre de la unidad" className="input flex-grow" />
          <input name="description" placeholder="Descripción" className="input flex-grow" />
          <button type="submit" className="btn-primary shrink-0">Crear unidad</button>
        </form>
        <div className="space-y-2">
          {units.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg">
              <span className="text-sm text-text-primary font-medium">{u.name}</span>
              <form action={async () => { 'use server'; await deleteSocietyUnit(u.id); }}>
                <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
