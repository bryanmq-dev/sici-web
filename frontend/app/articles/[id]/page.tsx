'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { articles } from '@/lib/data';
import { Calendar, User, Heart, Download, ArrowLeft, Share2, Bookmark, FileText, Users, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const article = articles.find(a => a.id === id);
  const [isRequesting, setIsRequesting] = React.useState(false);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-display mb-4">ARTÍCULO NO ENCONTRADO</h1>
        <Link href="/articles" className="hud-button">VOLVER AL REPOSITORIO</Link>
      </div>
    );
  }

  const handleRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      alert('Solicitud de colaboración enviada a los autores.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link href="/articles" className="inline-flex items-center gap-2 text-primary hover:glow-red transition-all font-mono text-xs uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Volver_al_Repositorio
            </Link>
          </motion.div>

          {/* Header Section */}
          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-1"
            >
              <div className="cyber-border relative aspect-[3/4] overflow-hidden group">
                <Image 
                  src={article.image} 
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                <div className="absolute top-0 left-0 w-full h-full border-[20px] border-black/20 pointer-events-none" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 flex flex-col justify-center"
            >
              <div className="hud-tag mb-6 inline-block w-fit">RESEARCH_AREA: {article.researchArea.toUpperCase()}</div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 uppercase leading-tight tracking-tighter">
                {article.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-y border-white/10 py-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-primary/50 uppercase">Autores</div>
                  <div className="text-sm font-display uppercase">{article.authors.join(', ')}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-primary/50 uppercase">Publicación</div>
                  <div className="text-sm font-display uppercase">{article.date}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-primary/50 uppercase">Impacto</div>
                  <div className="text-sm font-display uppercase">{article.likes} Citaciones</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-primary/50 uppercase">Formato</div>
                  <div className="text-sm font-display uppercase">PDF / DIGITAL</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a 
                  href={article.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hud-button flex items-center gap-2 px-8"
                >
                  DESCARGAR ARTÍCULO COMPLETO
                  <Download className="w-4 h-4" />
                </a>
                <button 
                  onClick={handleRequest}
                  disabled={isRequesting}
                  className="p-4 border border-white/10 hover:border-primary/50 hover:text-primary transition-all bg-white/5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest disabled:opacity-50"
                >
                  {isRequesting ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  {isRequesting ? 'PROCESANDO...' : 'SOLICITAR_COLABORACIÓN'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-8 md:p-12 cyber-border relative"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <FileText className="w-32 h-32" />
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="mb-12">
                    <h3 className="text-primary font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary animate-pulse" /> Resumen_Ejecutivo
                    </h3>
                    <p className="text-xl text-secondary font-body italic leading-relaxed opacity-90">
                      &quot;{article.abstract}&quot;
                    </p>
                  </div>

                  <div className="markdown-body font-body leading-relaxed text-secondary opacity-80">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-primary/30 uppercase">
                    SICI_RESEARCH_NETWORK // VERIFIED_PUBLICATION
                  </div>
                  <div className="flex items-center gap-2 text-primary font-mono text-[10px]">
                    <Heart className="w-3 h-3 fill-primary" /> {article.likes} INVESTIGADORES RECOMIENDAN ESTO
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="glass p-6 cyber-border">
                <h4 className="text-xs font-mono text-primary uppercase mb-4 tracking-widest">Impacto_Investigación</h4>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-secondary/60">RELEVANCIA</div>
                    <div className="text-[10px] font-mono text-primary">98%</div>
                  </div>
                  <div className="h-1 bg-white/5 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-secondary/60">CITACIONES</div>
                    <div className="text-[10px] font-mono text-primary">HIGH</div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-full h-2 ${i <= 4 ? 'bg-primary' : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <TrendingUp className="w-3 h-3" /> TENDENCIA_ALTA
                  </div>
                </div>
              </div>

              <div className="glass p-6 cyber-border">
                <h4 className="text-xs font-mono text-primary uppercase mb-4 tracking-widest">Investigadores</h4>
                <div className="space-y-4">
                  {article.authors.map((author, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-mono">
                        {author[0]}
                      </div>
                      <div className="text-[10px] font-display uppercase tracking-wider">{author}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
