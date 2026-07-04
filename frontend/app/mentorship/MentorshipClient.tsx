'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, Plus, Clock, CheckCircle2,
  MessageSquare, User, ArrowRight, Upload
} from 'lucide-react';
import { createMentorship } from '@/lib/actions/mentorship';
import { uploadMentorshipSyllabus } from '@/lib/actions/uploads';

interface MentorshipRequest {
  id: string;
  topic: string;
  description: string;
  status: string;
  kind: string;
  createdAt: Date;
  studentName: string | null;
  studentId: string | null;
  mentorId: string | null;
}

interface Mentor {
  id: string;
  specialty: string;
  userName: string | null;
}

export default function MentorshipClient({ requests, mentors }: { requests: MentorshipRequest[], mentors: Mentor[] }) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [modalKind, setModalKind] = useState<'request' | 'open'>('request');
  const [newRequest, setNewRequest] = useState({
    topic: '',
    description: '',
    categories: '',
  });
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (kind: 'request' | 'open') => {
    setModalKind(kind);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let syllabusUrl: string | undefined;
      if (modalKind === 'open' && syllabusFile) {
        const formData = new FormData();
        formData.set('file', syllabusFile);
        const result = await uploadMentorshipSyllabus(formData);
        syllabusUrl = result.url;
      }

      await createMentorship({
        topic: newRequest.topic,
        description: newRequest.description,
        kind: modalKind,
        syllabusUrl,
        categories: newRequest.categories.split(',').map(t => t.trim()).filter(Boolean),
      });

      setShowRequestModal(false);
      setNewRequest({ topic: '', description: '', categories: '' });
      setSyllabusFile(null);
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
        
        <div className="flex gap-3">
          <button
            onClick={() => openModal('request')}
            className="hud-button flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> SOLICITAR_MENTORÍA
          </button>
          <button
            onClick={() => openModal('open')}
            className="px-6 py-3 border border-primary/40 text-primary text-[10px] font-mono uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> ABRIR_MENTORÍA
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'SOLICITUDES_TOTALES', value: requests.length, icon: MessageSquare },
          { label: 'EN_CURSO', value: requests.filter(r => r.status === 'accepted').length, icon: Clock },
          { label: 'COMPLETADAS', value: requests.filter(r => r.status === 'completed').length, icon: CheckCircle2 },
          { label: 'MENTORES_ACTIVOS', value: mentors.length, icon: User },
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
            <div className="absolute top-0 left-0 px-4 py-1 text-[8px] font-mono uppercase tracking-widest bg-white/5 text-secondary">
              {request.kind === 'open' ? 'Mentoría abierta' : 'Solicitud de ayuda'}
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

              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-secondary/40" />
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-secondary/40 uppercase">Solicitado por</div>
                    <div className="text-[10px] font-bold text-on-surface uppercase tracking-tight">{request.studentName || 'Anónimo'}</div>
                  </div>
                </div>
              </div>

              <Link href={`/mentorship/${request.id}`} className="w-full py-3 bg-white/5 border border-white/10 text-[9px] font-mono text-secondary hover:text-primary hover:bg-white/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group/btn">
                VER_DETALLES <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-20">
          <p className="text-secondary font-mono text-sm uppercase tracking-widest">
            No hay solicitudes de mentoría
          </p>
        </div>
      )}

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
                <div className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-2">
                  {modalKind === 'open' ? 'NUEVA_MENTORÍA_ABIERTA' : 'NUEVA_SOLICITUD'}
                </div>
                <h2 className="text-3xl font-display font-bold uppercase tracking-tighter text-on-surface">
                  {modalKind === 'open' ? <>Abrir <span className="text-primary">Mentoría</span></> : <>Solicitar <span className="text-primary">Mentoría</span></>}
                </h2>
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
                  <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">Categorías (separadas por coma)</label>
                  <input
                    type="text"
                    value={newRequest.categories}
                    onChange={e => setNewRequest({...newRequest, categories: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                    placeholder="EJ: IA, PYTHON, OPTIMIZACIÓN"
                  />
                  <p className="text-[9px] font-mono text-secondary/40">Si la categoría no existe, se crea automáticamente.</p>
                </div>

                {modalKind === 'open' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-primary uppercase tracking-widest block flex items-center gap-2">
                      <Upload className="w-3 h-3" /> Temario_PDF (requerido)
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={e => setSyllabusFile(e.target.files?.[0] || null)}
                      className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono text-white file:hidden"
                    />
                  </div>
                )}

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
                    disabled={isSubmitting}
                    className="flex-1 hud-button disabled:opacity-50"
                  >
                    {isSubmitting ? 'ENVIANDO...' : 'ENVIAR_SOLICITUD'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
