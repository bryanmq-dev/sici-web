'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
}

export default function EnrollmentModal({ isOpen, onClose, courseName }: EnrollmentModalProps) {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');

  const handleEnroll = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inscripción al Programa"
      subtitle={`SICI_ACADEMY // ${courseName}`}
    >
      <div className="space-y-8">
        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="p-6 bg-primary/5 border border-primary/20 cyber-border">
              <h3 className="text-lg font-display font-bold uppercase tracking-tight text-white mb-4">Confirmar Protocolo de Acceso</h3>
              <p className="text-sm text-secondary font-body leading-relaxed opacity-80">
                Estás a punto de inscribirte en <span className="text-primary font-bold">{courseName}</span>. 
                Como miembro activo de la SICI, tienes acceso garantizado a este programa de formación técnica avanzada.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest">Beneficios_del_Programa</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Acceso a laboratorios virtuales',
                  'Certificación oficial SICI',
                  'Mentoría personalizada',
                  'Material de investigación exclusivo'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-body text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 max-w-md">
                <ShieldCheck className="w-6 h-6 text-secondary/40 shrink-0" />
                <p className="text-[9px] text-secondary/40 font-mono leading-relaxed">
                  AL INSCRIBIRTE, ACEPTAS LOS TÉRMINOS DE CONFIDENCIALIDAD Y EL CÓDIGO DE ÉTICA DEL INVESTIGADOR SICI.
                </p>
              </div>
              
              <button 
                onClick={handleEnroll}
                className="hud-button px-12 py-5 flex items-center gap-3 w-full sm:w-auto"
              >
                Confirmar Inscripción
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center">
              <div className="text-xl font-display font-bold text-white uppercase tracking-tighter">Procesando_Acceso</div>
              <p className="text-[10px] font-mono text-secondary/50 uppercase tracking-widest mt-2">Verificando credenciales en la red SICI...</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center glow-red">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tighter">Inscripción_Exitosa</h3>
              <p className="text-sm text-secondary font-body max-w-sm mx-auto opacity-80">
                Has sido registrado correctamente en el programa. El material de estudio ya está disponible en tu panel de control.
              </p>
            </div>

            <div className="pt-8 w-full">
              <button 
                onClick={onClose}
                className="hud-button w-full py-5 text-sm"
              >
                IR AL PANEL DE ESTUDIO
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
