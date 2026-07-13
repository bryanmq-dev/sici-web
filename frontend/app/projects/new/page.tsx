'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { createProject } from '@/lib/actions/projects';
import { getErrorMessage } from '@/lib/utils';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function NewProjectPage() {
  const router = useRouter();
  const { isReady, isLoading } = useRequireAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [supportSlots, setSupportSlots] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title || !description) return;
    setIsSubmitting(true);
    setError('');
    try {
      await createProject({
        title,
        category,
        description,
        content,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        supportSlots,
      });
      router.push('/projects');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isReady) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="text-text-muted text-sm">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Postular Proyecto de Investigación</h1>
            <p className="text-text-secondary text-sm">Tu proyecto quedará pendiente de aprobación del administrador antes de ser público.</p>
          </div>

          <div className="card p-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Título</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input w-full" placeholder="Título del proyecto" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Categoría</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="input w-full" placeholder="Ej: Inteligencia Artificial" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Descripción</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input w-full resize-none" placeholder="Resumen breve del proyecto" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Contenido (Markdown)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="input w-full resize-none font-mono text-sm" placeholder="Detalle completo del proyecto en Markdown" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-text-primary block mb-1.5">Tags (separados por coma)</label>
                <input value={tags} onChange={(e) => setTags(e.target.value)} className="input w-full" placeholder="IA, IoT, Seguridad" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary block mb-1.5">Cupos de apoyo</label>
                <input type="number" min={0} max={50} value={supportSlots} onChange={(e) => setSupportSlots(Number(e.target.value))} className="input w-full" />
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title || !description}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Enviando...' : 'Enviar para aprobación'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
