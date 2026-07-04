import { db } from '@/db';
import { users } from '@/db/schema';
import { getAllBadges, deleteBadge, createBadge, getAllQuestsForAdmin, createQuest, deleteQuest, getPointsLedger, awardPoints } from '@/lib/actions/gamification';
import { requireAdmin } from '@/lib/auth-helpers';
import { BADGE_RARITIES } from '@/lib/validations/gamification';

export const dynamic = 'force-dynamic';

export default async function AdminGamificationPage() {
  const [allBadges, allQuests, ledger, allUsers] = await Promise.all([
    getAllBadges(),
    getAllQuestsForAdmin(),
    getPointsLedger(),
    db.select({ id: users.id, name: users.name }).from(users).orderBy(users.name),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestión de Gamificación</h1>
        <p className="text-text-secondary">{allBadges.length} insignias, {allQuests.length} misiones</p>
      </div>

      {/* Otorgar puntos manual */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Otorgar puntos manual</h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            const admin = await requireAdmin();
            await awardPoints({
              userId: String(formData.get('userId')),
              amount: Number(formData.get('amount')),
              reason: String(formData.get('reason')),
              awardedBy: admin.id,
            });
          }}
          className="grid sm:grid-cols-4 gap-4"
        >
          <select name="userId" required className="input">
            {allUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <input name="amount" type="number" required placeholder="Puntos" className="input" />
          <input name="reason" required placeholder="Motivo" className="input sm:col-span-1" />
          <button type="submit" className="btn-primary">Otorgar</button>
        </form>
      </div>

      {/* Badges */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Insignias</h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createBadge({
              name: String(formData.get('name')),
              rarity: formData.get('rarity') as any,
              description: String(formData.get('description') || '') || undefined,
              icon: String(formData.get('icon') || '') || undefined,
            });
          }}
          className="grid sm:grid-cols-4 gap-4 mb-6"
        >
          <input name="name" required placeholder="Nombre" className="input" />
          <select name="rarity" required className="input">
            {BADGE_RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <input name="icon" placeholder="Icono (lucide, ej. Trophy)" className="input" />
          <input name="description" placeholder="Descripción" className="input" />
          <button type="submit" className="btn-primary sm:col-span-4">Crear insignia</button>
        </form>
        <div className="space-y-2">
          {allBadges.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg">
              <div>
                <span className="text-sm text-text-primary font-medium">{b.name}</span>
                <span className="badge badge-secondary text-xs ml-2">{b.rarity}</span>
              </div>
              <form action={async () => { 'use server'; await deleteBadge(b.id); }}>
                <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </div>

      {/* Quests */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Misiones</h2>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createQuest({
              title: String(formData.get('title')),
              category: String(formData.get('category')),
              difficulty: String(formData.get('difficulty')),
              pointsReward: Number(formData.get('pointsReward')),
              triggerType: String(formData.get('triggerType') || '') || undefined,
              triggerThreshold: formData.get('triggerThreshold') ? Number(formData.get('triggerThreshold')) : undefined,
              description: String(formData.get('description') || '') || undefined,
            });
          }}
          className="grid sm:grid-cols-3 gap-4 mb-6"
        >
          <input name="title" required placeholder="Título" className="input" />
          <input name="category" required placeholder="Categoría (ej. dev)" className="input" />
          <input name="difficulty" required placeholder="Dificultad (EASY/MEDIUM/HARD)" className="input" />
          <input name="pointsReward" type="number" required placeholder="Puntos de recompensa" className="input" />
          <input name="triggerType" placeholder="triggerType (ej. forum_answer_posted)" className="input" />
          <input name="triggerThreshold" type="number" placeholder="Umbral" className="input" />
          <textarea name="description" placeholder="Descripción" rows={2} className="input sm:col-span-3 resize-none" />
          <button type="submit" className="btn-primary sm:col-span-3">Crear misión</button>
        </form>
        <div className="space-y-2">
          {allQuests.map((q) => (
            <div key={q.id} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg">
              <div>
                <span className="text-sm text-text-primary font-medium">{q.title}</span>
                <span className="text-xs text-text-muted ml-2">{q.triggerType ? `trigger: ${q.triggerType} x${q.triggerThreshold}` : 'sin auto-trigger'} · +{q.pointsReward}pts</span>
              </div>
              <form action={async () => { 'use server'; await deleteQuest(q.id); }}>
                <button type="submit" className="text-xs font-medium text-red-500 hover:text-red-600">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-muted">
          <h2 className="text-sm font-semibold text-text-primary">Historial de puntos (últimos 100)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-xs font-semibold text-text-muted uppercase">Usuario</th>
                <th className="text-left p-3 text-xs font-semibold text-text-muted uppercase">Monto</th>
                <th className="text-left p-3 text-xs font-semibold text-text-muted uppercase">Motivo</th>
                <th className="text-left p-3 text-xs font-semibold text-text-muted uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row) => (
                <tr key={row.id} className="border-b border-border">
                  <td className="p-3 text-sm text-text-primary">{row.userName}</td>
                  <td className="p-3 text-sm font-mono text-primary">{row.amount > 0 ? '+' : ''}{row.amount}</td>
                  <td className="p-3 text-sm text-text-secondary">{row.reason}</td>
                  <td className="p-3 text-xs text-text-muted">{row.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
