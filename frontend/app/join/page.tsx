'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, BookOpen, Code, Send, ShieldCheck } from 'lucide-react';

export default function JoinPage() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full glass p-12 text-center cyber-border relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary glow-red" />
            <ShieldCheck className="w-20 h-20 text-primary mx-auto mb-6 glow-red" />
            <h1 className="text-3xl font-display font-bold mb-4 uppercase tracking-tighter">Solicitud Recibida</h1>
            <p className="text-secondary font-body mb-8 opacity-70">
              Tu protocolo de ingreso ha sido iniciado. Nuestro equipo de revisión analizará tu perfil y te contactará vía email institucional en las próximas 48 horas.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="hud-button w-full"
            >
              Volver al Inicio
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hud-tag mb-4 inline-block">Recruitment_Protocol_v2.4</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Únete a la <span className="text-primary glow-red">SICI</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Estamos buscando mentes brillantes apasionadas por la investigación y el desarrollo tecnológico. Completa tu perfil para iniciar el proceso de selección.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 md:p-12 cyber-border relative"
          >
            <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">SEC_AUTH_REQUIRED</div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <User className="w-3 h-3" /> Nombre Completo
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="EJ. ALEJANDRO CHIPANA"
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email Institucional
                  </label>
                  <input 
                    required
                    type="email" 
                    placeholder="USUARIO@UNIVALLE.EDU"
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Semestre Actual
                  </label>
                  <select className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white appearance-none">
                    {[1,2,3,4,5,6,7,8,9,10].map(s => (
                      <option key={s} value={s} className="bg-surface-container">{s}° SEMESTRE</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Code className="w-3 h-3" /> Área de Interés
                  </label>
                  <select className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white appearance-none">
                    <option className="bg-surface-container">INTELIGENCIA ARTIFICIAL</option>
                    <option className="bg-surface-container">CIBERSEGURIDAD</option>
                    <option className="bg-surface-container">BLOCKCHAIN / WEB3</option>
                    <option className="bg-surface-container">IOT / ROBÓTICA</option>
                    <option className="bg-surface-container">DESARROLLO FULLSTACK</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  ¿Por qué quieres unirte a la SICI?
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder="DESCRIBE TUS MOTIVACIONES Y EXPERIENCIA PREVIA..."
                  className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase resize-none"
                />
              </div>

              <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <p className="text-[9px] text-secondary font-mono leading-relaxed">
                  AL ENVIAR ESTA SOLICITUD, ACEPTAS LOS TÉRMINOS DE INVESTIGACIÓN Y ÉTICA TECNOLÓGICA DE LA SICI - UNIVALLE. TU INFORMACIÓN SERÁ TRATADA BAJO PROTOCOLOS DE CONFIDENCIALIDAD.
                </p>
              </div>

              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="hud-button w-full py-6 flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {status === 'submitting' ? 'PROCESANDO...' : (
                  <>
                    ENVIAR SOLICITUD DE INGRESO
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
