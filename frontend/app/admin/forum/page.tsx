import { db } from '@/db';
import { forumQuestions, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { deleteForumQuestion } from '@/lib/actions/forum';

export const dynamic = 'force-dynamic';

export default async function AdminForumPage() {
  const allQuestions = await db
    .select({
      id: forumQuestions.id,
      title: forumQuestions.title,
      views: forumQuestions.views,
      likes: forumQuestions.likes,
      isSolved: forumQuestions.isSolved,
      createdAt: forumQuestions.createdAt,
      authorName: users.name,
    })
    .from(forumQuestions)
    .leftJoin(users, eq(forumQuestions.authorId, users.id))
    .orderBy(desc(forumQuestions.createdAt));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Moderación del Foro</h1>
        <p className="text-text-secondary">{allQuestions.length} preguntas en el foro</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Título</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Autor</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Vistas</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Likes</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Resuelto</th>
                <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allQuestions.map(q => (
                <tr key={q.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="p-4 text-sm text-text-primary font-medium">{q.title}</td>
                  <td className="p-4 text-sm text-text-secondary">{q.authorName || 'N/A'}</td>
                  <td className="p-4 text-sm text-text-primary font-mono">{q.views}</td>
                  <td className="p-4 text-sm text-text-primary font-mono">{q.likes}</td>
                  <td className="p-4">
                    <span className={`badge ${q.isSolved ? 'badge-success' : 'badge-secondary'}`}>
                      {q.isSolved ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="p-4">
                    <form action={async () => { 'use server'; await deleteForumQuestion(q.id); }}>
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
