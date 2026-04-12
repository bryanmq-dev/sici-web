'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuestionModal from '@/components/QuestionModal';
import ForumQuestionCard from '@/components/ForumQuestionCard';
import { questions } from '@/lib/data';
import { MessageSquare, Heart, Calendar, User, Search, Filter, MessageCircle, ArrowUpRight, Plus, Eye, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForumPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (activeTab === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (activeTab === 'votes') return b.likes - a.likes;
    if (activeTab === 'views') return b.views - a.views;
    return 0;
  });

  const allTags = Array.from(new Set(questions.flatMap(q => q.tags)));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="hud-tag inline-block">SICI_NETWORK // FORUM_V2.0</div>
              <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter uppercase text-on-surface">
                Foro de <span className="text-primary glow-red">Consultas</span>
              </h1>
              <p className="text-secondary font-body opacity-60 max-w-xl">
                Plataforma de intercambio de conocimiento técnico y resolución de problemas para la comunidad SICI.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button 
                onClick={() => setIsModalOpen(true)}
                className="hud-button flex items-center gap-2 py-4 px-8"
              >
                HACER UNA PREGUNTA
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          <QuestionModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0 space-y-12 order-2 lg:order-1">
              {/* Search */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest">Búsqueda_Rápida</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/50" />
                  <input 
                    type="text" 
                    placeholder="Filtrar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-container border border-outline/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-on-surface uppercase"
                  />
                </div>
              </div>

              {/* Popular Tags */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest">Etiquetas_Populares</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="text-[9px] font-mono text-secondary border border-outline/10 px-2 py-1 hover:border-primary/50 hover:text-primary transition-all uppercase"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <div className="glass p-6 cyber-border border-primary/10">
                <h4 className="text-[10px] font-mono text-primary uppercase mb-4 tracking-widest">Estado_Comunidad</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-secondary uppercase">Consultas</span>
                    <span className="text-xs font-display text-on-surface">{questions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-secondary uppercase">Respuestas</span>
                    <span className="text-xs font-display text-on-surface">
                      {questions.reduce((acc, q) => acc + q.answers.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-secondary uppercase">Activos</span>
                    <span className="text-xs font-display text-on-surface">142</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow order-1 lg:order-2 space-y-8">
              {/* Sorting Tabs */}
              <div className="flex items-center justify-between border-b border-outline/10 pb-4">
                <div className="flex gap-6">
                  {[
                    { id: 'newest', label: 'Recientes', icon: Clock },
                    { id: 'votes', label: 'Más Votados', icon: TrendingUp },
                    { id: 'views', label: 'Populares', icon: Eye },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-all ${
                        activeTab === tab.id ? 'text-primary' : 'text-secondary/50 hover:text-secondary'
                      }`}
                    >
                      <tab.icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="text-[9px] font-mono text-secondary/40 uppercase">
                  Mostrando {sortedQuestions.length} resultados
                </div>
              </div>

              {/* Question List */}
              <div className="space-y-4">
                {sortedQuestions.map((question, idx) => (
                  <ForumQuestionCard key={question.id} question={question} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
