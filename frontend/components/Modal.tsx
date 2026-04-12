'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

export default function Modal({ isOpen, onClose, title, children, subtitle }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl glass cyber-border bg-background/95 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline/10 flex items-center justify-between shrink-0">
              <div>
                <div className="text-[8px] font-mono text-primary uppercase tracking-[0.3em] mb-1">SICI_SYSTEM // MODAL_ACTIVE</div>
                <h2 className="text-2xl font-display font-bold uppercase tracking-tighter text-on-surface">{title}</h2>
                {subtitle && <p className="text-[10px] font-mono text-secondary/50 uppercase mt-1">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary/5 rounded-full transition-colors text-secondary hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
