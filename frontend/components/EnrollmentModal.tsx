'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { enrollInCourse } from '@/lib/actions/courses';
import { getErrorMessage } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  onEnrolled: () => void;
}

export default function EnrollmentModal({ isOpen, onClose, courseId, courseName, onEnrolled }: EnrollmentModalProps) {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEnroll = async () => {
    setError('');
    setStep('processing');
    try {
      await enrollInCourse(courseId);
      setStep('success');
      onEnrolled();
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
      setStep('confirm');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inscripción al Programa"
      subtitle={courseName}
    >
      <div className="space-y-6">
        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-6 bg-primary/5 border-primary/20">
              <h3 className="text-base font-semibold text-text-primary mb-3">Confirmar Inscripción</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Estás a punto de inscribirte en <span className="text-primary font-semibold">{courseName}</span>.
                Como miembro activo de la SICI, tienes acceso garantizado a este programa de formación técnica.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs text-text-muted uppercase tracking-wide">Beneficios del Programa</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Acceso a laboratorios virtuales',
                  'Certificación oficial SICI',
                  'Mentoría personalizada',
                  'Material de investigación exclusivo'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="badge badge-error">{error}</div>}

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                onClick={handleEnroll}
                className="btn-primary flex items-center justify-center gap-2 p-2 rounded-sm w-full sm:w-auto"
              >
                Confirmar Inscripción
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <div className="py-16 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-text-muted">Procesando tu inscripción...</p>
          </div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-text-primary">Inscripción Exitosa</h3>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Has sido registrado correctamente en el programa. El material de estudio ya está disponible.
              </p>
            </div>

            <button
              onClick={onClose}
              className="btn-primary flex items-center justify-center gap-2 p-2 rounded-sm w-full"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
