'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { articles } from '@/lib/data';
import { FileText, Download, Heart, Calendar, User, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeArea, setActiveArea] = React.useState('Todos');

  const researchAreas = ['Todos', ...Array.from(new Set(articles.map(a => a.researchArea)))];

  const filteredArticles = articles.filter(article => {
    const matchesArea = activeArea === 'Todos' || article.researchArea === activeArea;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.researchArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesArea && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hud-tag mb-4 inline-block">Research_Repository_v1.2</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Artículos <span className="text-primary glow-red">Científicos</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Explora el repositorio de investigaciones publicadas por los miembros de la SICI. Conocimiento abierto para forjar el futuro.
              </p>
            </motion.div>
          </div>

          <div className="mb-16 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
              <input 
                type="text" 
                placeholder="BUSCAR INVESTIGACIÓN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {researchAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setActiveArea(area)}
                  className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    activeArea === area 
                      ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(211,29,36,0.3)]' 
                      : 'bg-surface-container-high border-white/5 text-secondary hover:border-primary/50'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hud-tag flex items-center gap-2">
                <Filter className="w-3 h-3" /> Filter_Active: {activeArea.toUpperCase()}
              </div>
              <div className="hud-tag text-primary">
                Total_Results: {filteredArticles.length}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass cyber-border group relative overflow-hidden flex flex-col"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 hud-tag bg-black/80 backdrop-blur-md border-primary/30 text-[8px]">
                    ID: {article.id}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="hud-tag bg-primary/20 border-primary/40 text-primary text-[10px] mb-2 inline-block">
                      {article.researchArea.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors leading-tight mb-4 line-clamp-2">
                    {article.title}
                  </h2>
                  
                  <p className="text-secondary text-xs font-body leading-relaxed opacity-70 line-clamp-3 mb-6">
                    {article.abstract}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[8px] font-mono text-outline uppercase tracking-widest">
                        <User className="w-3 h-3 text-primary" /> {article.authors[0]} {article.authors.length > 1 && `+${article.authors.length - 1}`}
                      </div>
                      <div className="flex items-center gap-2 text-[8px] font-mono text-outline uppercase tracking-widest ml-auto">
                        <Calendar className="w-3 h-3 text-primary" /> {article.date}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <Link 
                        href={`/articles/${article.id}`}
                        className="hud-button flex-grow text-center text-[10px] py-2"
                      >
                        VER DETALLES
                      </Link>
                      <a 
                        href={article.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 border border-white/10 hover:border-primary/50 hover:text-primary transition-all bg-white/5"
                        title="Descargar PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
