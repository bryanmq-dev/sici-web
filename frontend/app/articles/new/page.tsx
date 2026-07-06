'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Markdown from 'react-markdown';
import {
  FileText, Eye, Edit3, Save, Send,
  Info, Microscope, Layout, ArrowLeft,
  Shield, Zap, Cpu, Code2
} from 'lucide-react';
import Link from 'next/link';
import { createArticle } from '@/lib/actions/articles';
import { getErrorMessage } from '@/lib/utils';

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('# Título del Artículo\n\nEscribe aquí tu investigación usando **Markdown**.\n\n## Introducción\n...');
  const [view, setView] = useState<'edit' | 'preview' | 'split'>('split');
  const [execSummary, setExecSummary] = useState({ introduccion: '', metodologia: '', resultados: '', conclusion: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePublish = async () => {
    if (!title || !abstract) return;
    setIsSubmitting(true);
    setError('');
    try {
      await createArticle({ title, researchArea, abstract, content, execSummary });
      router.push('/articles');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="space-y-1">
              <Link href="/articles" className="text-[10px] font-mono text-primary hover:glow-red flex items-center gap-2 mb-4">
                <ArrowLeft className="w-3 h-3" /> VOLVER_A_ARTÍCULOS
              </Link>
              <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase tracking-[0.3em]">
                <Edit3 className="w-3 h-3" /> EDITOR_DE_INVESTIGACIÓN_V2.0
              </div>
              <h1 className="text-4xl font-display font-bold uppercase tracking-tighter text-on-surface">
                Redactar <span className="text-primary">Artículo</span>
              </h1>
            </div>
            
            <div className="flex gap-4">
              <div className="flex bg-white/5 border border-white/10 p-1 cyber-border">
                <button 
                  onClick={() => setView('edit')}
                  className={`px-4 py-2 text-[8px] font-mono uppercase tracking-widest transition-all ${view === 'edit' ? 'bg-primary text-background' : 'text-secondary hover:text-white'}`}
                >
                  EDITOR
                </button>
                <button 
                  onClick={() => setView('split')}
                  className={`px-4 py-2 text-[8px] font-mono uppercase tracking-widest transition-all ${view === 'split' ? 'bg-primary text-background' : 'text-secondary hover:text-white'}`}
                >
                  DIVIDIDO
                </button>
                <button 
                  onClick={() => setView('preview')}
                  className={`px-4 py-2 text-[8px] font-mono uppercase tracking-widest transition-all ${view === 'preview' ? 'bg-primary text-background' : 'text-secondary hover:text-white'}`}
                >
                  VISTA_PREVIA
                </button>
              </div>
              <button onClick={handlePublish} disabled={isSubmitting || !title || !abstract} className="hud-button flex items-center gap-2 disabled:opacity-50">
                <Send className="w-4 h-4" /> {isSubmitting ? 'ENVIANDO...' : 'PUBLICAR_INVESTIGACIÓN'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">Título_del_Artículo</label>
              <input 
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                placeholder="EJ: IMPACTO_DE_LA_IA_EN_LA_CIBERSEGURIDAD"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">Área_de_Investigación</label>
              <select 
                value={researchArea}
                onChange={e => setResearchArea(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
              >
                <option value="">SELECCIONAR_ÁREA</option>
                <option value="Ciberseguridad">CIBERSEGURIDAD</option>
                <option value="IA">INTELIGENCIA_ARTIFICIAL</option>
                <option value="Blockchain">BLOCKCHAIN</option>
                <option value="IoT">IOT</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">Resumen (Abstract)</label>
              <input 
                type="text"
                value={abstract}
                onChange={e => setAbstract(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                placeholder="BREVE_DESCRIPCIÓN_DE_LA_INVESTIGACIÓN"
              />
            </div>
          </div>

          {/* Resumen Ejecutivo */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {([
              ['introduccion', 'Introducción'],
              ['metodologia', 'Metodología'],
              ['resultados', 'Resultados'],
              ['conclusion', 'Conclusión'],
            ] as const).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">{label}</label>
                <textarea
                  value={execSummary[key]}
                  onChange={e => setExecSummary(prev => ({ ...prev, [key]: e.target.value }))}
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white resize-none"
                  placeholder={`${label}_DE_LA_INVESTIGACIÓN`}
                />
              </div>
            ))}
          </div>

          {/* Editor/Preview Area */}
          <div className={`grid gap-8 ${view === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            
            {/* Editor */}
            {(view === 'edit' || view === 'split') && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass cyber-border flex flex-col h-[600px]"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <div className="text-[8px] font-mono text-primary uppercase tracking-[0.2em]">CÓDIGO_FUENTE_MARKDOWN</div>
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="flex-grow bg-transparent p-8 text-sm font-mono text-secondary/80 focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </motion.div>
            )}

            {/* Preview */}
            {(view === 'preview' || view === 'split') && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass cyber-border flex flex-col h-[600px] overflow-hidden"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <div className="text-[8px] font-mono text-secondary uppercase tracking-[0.2em]">VISTA_PREVIA_RENDERIZADA</div>
                  <div className="text-[8px] font-mono text-primary/40 uppercase">SICI_RENDER_ENGINE_V1</div>
                </div>
                <div className="flex-grow overflow-y-auto p-8 md:p-12 prose prose-invert prose-primary max-w-none">
                  <div className="markdown-body">
                    <Markdown>{content}</Markdown>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 flex justify-between items-center text-[8px] font-mono text-secondary/30 uppercase tracking-[0.3em]">
            <div>Autoguardado: Activo</div>
            <div>Caracteres: {content.length}</div>
            <div>Líneas: {content.split('\n').length}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
