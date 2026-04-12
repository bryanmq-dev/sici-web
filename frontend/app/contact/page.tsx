'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
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
            <MessageSquare className="w-20 h-20 text-primary mx-auto mb-6 glow-red" />
            <h1 className="text-3xl font-display font-bold mb-4 uppercase tracking-tighter">Mensaje Enviado</h1>
            <p className="text-secondary font-body mb-8 opacity-70">
              Tu comunicación ha sido encriptada y enviada a la central de la SICI. Te responderemos a la brevedad posible.
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hud-tag mb-4 inline-block">Contact_Protocol_v1.0</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Establecer <span className="text-primary glow-red">Contacto</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                ¿Tienes alguna duda, propuesta o quieres colaborar? Estamos a un mensaje de distancia.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-8 cyber-border relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">CHANNEL_01</div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center border border-primary/40 bg-primary/5">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Email_Oficial</h3>
                    <p className="text-sm font-mono text-on-surface">contacto@sici.edu.pe</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center border border-primary/40 bg-primary/5">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Línea_Directa</h3>
                    <p className="text-sm font-mono text-on-surface">+51 987 654 321</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border border-primary/40 bg-primary/5">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Ubicación_Física</h3>
                    <p className="text-sm font-mono text-on-surface">Campus UNIVALLE, Pabellón de Ingeniería, Piso 4.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-8 cyber-border relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">SOCIAL_SYNC</div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Redes_Sociales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="#" className="flex items-center gap-2 text-[10px] font-mono text-secondary hover:text-primary transition-colors">
                    <Globe className="w-3 h-3" /> LINKEDIN
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[10px] font-mono text-secondary hover:text-primary transition-colors">
                    <Globe className="w-3 h-3" /> INSTAGRAM
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[10px] font-mono text-secondary hover:text-primary transition-colors">
                    <Globe className="w-3 h-3" /> FACEBOOK
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[10px] font-mono text-secondary hover:text-primary transition-colors">
                    <Globe className="w-3 h-3" /> TWITTER
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 glass p-8 md:p-12 cyber-border relative"
            >
              <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">MESSAGE_ENCRYPTION_ACTIVE</div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Nombre_Completo</label>
                    <input 
                      required
                      type="text" 
                      placeholder="EJ. ALEJANDRO CHIPANA"
                      className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Email_Contacto</label>
                    <input 
                      required
                      type="email" 
                      placeholder="USUARIO@EMAIL.COM"
                      className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Asunto_Mensaje</label>
                  <input 
                    required
                    type="text" 
                    placeholder="MOTIVO DE TU CONSULTA..."
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Cuerpo_del_Mensaje</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="ESCRIBE TU MENSAJE AQUÍ..."
                    className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                  <p className="text-[9px] text-secondary font-mono leading-relaxed">
                    TU MENSAJE SERÁ TRATADO BAJO PROTOCOLOS DE SEGURIDAD Y PRIVACIDAD DE LA SICI - UNIVALLE.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="hud-button w-full py-6 flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'ENVIANDO...' : (
                    <>
                      ENVIAR MENSAJE
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
