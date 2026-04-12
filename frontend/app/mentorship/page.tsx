'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mentorshipRequests, MentorshipRequest } from '@/lib/data';
import { 
  GraduationCap, Search, Plus, Clock, CheckCircle2, 
  MessageSquare, Tag, User, Calendar, ArrowRight,
  Shield, Zap, Cpu, Microscope, Code2
} from 'lucide-react';

export default function MentorshipPage() {
  const [requests, setRequests] = useState<MentorshipRequest[]>(mentorshipRequests);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    topic: '',
    description: '',
    tags: ''
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const request: MentorshipRequest = {
      id: `mr${requests.length + 1}`,
      topic: newRequest.topic,
      description: newRequest.description,
      studentId: 'u1', // Current user
      studentName: 'Alejandro Chipana',
      status: 'pending',
      date: new Date().toISOString(),
      tags: newRequest.tags.split(',').map(t => t.trim())
    };
    setRequests([request, ...requests]);
    setShowRequestModal(false);
    setNewRequest({ topic: '', description: '', tags: '' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase tracking-[0.3em]">
                <GraduationCap className="w-3 h-3" /> SISTEMA_DE_MENTORÍAS_V1.0
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-on-surface leading-none">
                Hub de <span className="text-primary glow-red">Conocimiento</span>
              </h1>
              <p className="text-secondary/60 max-w-2xl font-body text-lg">
                Solicita orientación técnica o científica por tema. Nuestra red de mentores (docentes e investigadores senior) revisará tu solicitud para guiarte en tu camino.
              </p>
            </div>
            
            <button 
              onClick={() => setShowRequestModal(true)}
              className="hud-button flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> SOLICITAR_MENTORÍA
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'SOLICITUDES_TOTALES', value: requests.length, icon: MessageSquare },
              { label: 'EN_CURSO', value: requests.filter(r => r.status === 'accepted').length, icon: Clock },
              { label: 'COMPLETADAS', value: requests.filter(r => r.status === 'completed').length, icon: CheckCircle2 },
              { label: 'MENTORES_ACTIVOS', value: 12, icon: User },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 cyber-border flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-sm">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-2xl font-display font-bold text-on-surface">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Requests Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 cyber-border relative overflow-hidden group hover:border-primary/50 transition-all"
              >
                {/* Status Badge */}
                <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-mono uppercase tracking-widest ${
                  request.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                  request.status === 'accepted' ? 'bg-primary/20 text-primary' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {request.status}
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="text-[8px] font-mono text-primary/40 uppercase tracking-widest">TEMA_DE_INVESTIGACIÓN</div>
                    <h3 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                      {request.topic}
                    </h3>
                  </div>

                  <p className="text-[11px] text-secondary/70 font-body leading-relaxed line-clamp-3">
                    {request.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {request.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 text-[8px] font-mono text-secondary/60 uppercase tracking-widest">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-secondary/40" />
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-secondary/40 uppercase">Solicitado por</div>
                        <div className="text-[10px] font-bold text-on-surface uppercase tracking-tight">{request.studentName}</div>
                      </div>
                    </div>
                    {request.mentorName && (
                      <div className="text-right">
                        <div className="text-[8px] font-mono text-primary/40 uppercase">Mentor asignado</div>
                        <div className="text-[10px] font-bold text-primary uppercase tracking-tight">{request.mentorName}</div>
                      </div>
                    )}
                  </div>

                  <button className="w-full py-3 bg-white/5 border border-white/10 text-[9px] font-mono text-secondary hover:text-primary hover:bg-white/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group/btn">
                    VER_DETALLES_Y_CHAT <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass p-8 cyber-border"
            >
              <div className="mb-8">
                <div className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-2">NUEVA_SOLICITUD</div>
                <h2 className="text-3xl font-display font-bold uppercase tracking-tighter text-on-surface">Solicitar <span className="text-primary">Mentoría</span></h2>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">Tema_Principal</label>
                  <input 
                    type="text"
                    required
                    value={newRequest.topic}
                    onChange={e => setNewRequest({...newRequest, topic: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                    placeholder="EJ: INTELIGENCIA_ARTIFICIAL_EN_EDGE"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">Descripción_del_Problema</label>
                  <textarea 
                    required
                    rows={4}
                    value={newRequest.description}
                    onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase resize-none"
                    placeholder="DESCRIBE_EN_QUÉ_NECESITAS_AYUDA..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">Etiquetas (separadas por coma)</label>
                  <input 
                    type="text"
                    value={newRequest.tags}
                    onChange={e => setNewRequest({...newRequest, tags: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                    placeholder="EJ: IA, PYTHON, OPTIMIZACIÓN"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 py-4 border border-white/10 text-[10px] font-mono uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 hud-button"
                  >
                    ENVIAR_SOLICITUD
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
