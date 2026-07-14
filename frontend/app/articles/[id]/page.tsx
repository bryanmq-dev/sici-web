import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Download, Heart } from 'lucide-react';
import Markdown from 'react-markdown';
import { auth } from '@/lib/auth';
import { getArticleById } from '@/lib/actions/articles';
import { toggleLike } from '@/lib/actions/likes';
import { db } from '@/db';
import { users } from '@/db/schema';
import { inArray } from 'drizzle-orm';

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const article = await getArticleById(id);

  const isAuthor = !!session?.user && !!article?.authorIds?.includes(session.user.id);
  const isAdmin = session?.user?.role === 'admin';

  if (!article || (article.status !== 'approved' && !isAuthor && !isAdmin)) {
    notFound();
  }

  const authors = article.authorIds && article.authorIds.length > 0
    ? await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, article.authorIds))
    : [];

  const execSummary = (article.execSummary || {}) as Record<string, string>;

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver a Artículos
          </Link>

          {article.status !== 'approved' && (
            <div className="badge badge-warning">Pendiente de aprobación — solo visible para autores y administradores</div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            {article.image && (
              <div className="lg:col-span-1 aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image src={article.image} alt={article.title} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <div className={article.image ? 'lg:col-span-2' : 'lg:col-span-3'}>
              {article.researchArea && <span className="badge-primary text-xs mb-4 inline-block">{article.researchArea}</span>}
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{article.title}</h1>

              <div className="grid grid-cols-2 gap-6 mb-6 border-y border-border py-6">
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide">Autores</div>
                  <div className="text-sm text-text-primary">{authors.map((a) => a.name).join(', ') || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Publicación</div>
                  <div className="text-sm text-text-primary">{article.publicationDate ? new Date(article.publicationDate).toLocaleDateString('es-PE') : 'Pendiente'}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {article.pdfUrl && (
                  <a href={article.pdfUrl} className="btn-primary flex items-center gap-2">
                    <Download className="w-4 h-4" /> Descargar PDF
                  </a>
                )}
                {session?.user && (
                  <form action={async () => { 'use server'; await toggleLike('article', article.id); }}>
                    <button type="submit" className="btn-secondary flex items-center gap-2">
                      <Heart className="w-4 h-4" /> {article.likes} likes
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="card p-8 md:p-12 space-y-8">
            <div>
              <h3 className="text-primary text-sm font-semibold uppercase tracking-wide mb-3">Resumen ejecutivo</h3>
              <p className="text-lg text-text-secondary italic">&quot;{article.abstract}&quot;</p>
            </div>

            {(execSummary.introduccion || execSummary.metodologia || execSummary.resultados || execSummary.conclusion) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {execSummary.introduccion && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Introducción</h4>
                    <p className="text-sm text-text-secondary">{execSummary.introduccion}</p>
                  </div>
                )}
                {execSummary.metodologia && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Metodología</h4>
                    <p className="text-sm text-text-secondary">{execSummary.metodologia}</p>
                  </div>
                )}
                {execSummary.resultados && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Resultados</h4>
                    <p className="text-sm text-text-secondary">{execSummary.resultados}</p>
                  </div>
                )}
                {execSummary.conclusion && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Conclusión</h4>
                    <p className="text-sm text-text-secondary">{execSummary.conclusion}</p>
                  </div>
                )}
              </div>
            )}

            {article.content && (
              <div className="prose prose-invert max-w-none">
                <Markdown>{article.content}</Markdown>
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
