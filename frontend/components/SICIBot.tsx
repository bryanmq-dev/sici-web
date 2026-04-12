'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Bot, User, 
  Sparkles, Zap, Shield, Cpu, Microscope, Code2,
  ChevronRight, ArrowRight, Terminal
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export default function SICIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'SISTEMA_SICI_ONLINE // Hola, soy el asistente de IA de la Sociedad. ¿En qué puedo ayudarte hoy? Puedo resumir investigaciones, sugerir proyectos o guiarte en la plataforma.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage,
        config: {
          systemInstruction: `Eres SICI-Bot, el asistente de inteligencia artificial de la Sociedad de Investigación, Ciencia e Innovación (SICI) de la carrera de Ingeniería de Sistemas e Informática de UNIVALLE. 
          Tu tono es profesional, técnico, pero inspirador, con una estética cyberpunk/futurista. 
          Ayudas a los estudiantes a:
          1. Encontrar artículos de investigación.
          2. Sugerir proyectos para la incubadora.
          3. Explicar conceptos técnicos de IA, Ciberseguridad y Blockchain.
          4. Guiar sobre cómo subir de rango en la plataforma (DevCore e Insight Points).
          Responde siempre en español y usa términos como "Conexión establecida", "Procesando datos", "Terminal SICI".`,
        },
      });

      const botMessage = response.text || "ERROR_DE_CONEXIÓN // No pude procesar tu solicitud.";
      setMessages(prev => [...prev, { role: 'bot', content: botMessage }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "ERROR_CRÍTICO // El núcleo de IA no responde. Intenta de nuevo más tarde." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            className="fixed inset-0 md:absolute md:inset-auto md:bottom-24 md:right-0 w-full h-full md:w-[450px] md:h-[650px] glass border border-primary/20 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(211,29,36,0.2)] z-[101]"
          >
            {/* Header */}
            <div className="p-6 border-b border-primary/20 bg-primary/5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 glass border border-primary/40 flex items-center justify-center glow-red relative group">
                  <Bot className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <div className="absolute -inset-1 bg-primary/20 animate-pulse rounded-sm" />
                </div>
                <div>
                  <div className="text-[12px] font-mono font-bold text-primary uppercase tracking-[0.3em]">SICI_NEURAL_LINK</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                    <span className="text-[8px] font-mono text-secondary uppercase tracking-widest opacity-60">CORE_STABLE // SYNC_100%</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-primary/10 text-secondary hover:text-primary transition-all glass border border-primary/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-primary/20 bg-background/60 relative"
            >
              <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 text-[12px] font-mono leading-relaxed relative ${
                    msg.role === 'user' 
                      ? 'bg-primary/10 border border-primary/30 text-primary' 
                      : 'glass border border-primary/10 text-secondary'
                  }`}>
                    <div className={`absolute top-0 ${msg.role === 'user' ? 'right-0' : 'left-0'} p-1`}>
                      <div className={`w-1.5 h-1.5 ${msg.role === 'user' ? 'bg-primary' : 'bg-primary/40'}`} />
                    </div>
                    <div className="opacity-90">{msg.content}</div>
                    {msg.role === 'bot' && (
                      <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2 text-[8px] opacity-40 uppercase tracking-widest">
                        <Terminal className="w-3 h-3" />
                        SICI_ENCRYPTED_STREAM
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass border border-primary/20 p-5">
                    <div className="flex gap-2">
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-primary" />
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-primary" />
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-primary" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
              <div className="relative z-10">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="ESCRIBE_TU_CONSULTA..."
                  className="w-full bg-background/40 border border-primary/20 p-5 pl-14 text-[11px] font-mono focus:border-primary/60 outline-none transition-all text-on-surface uppercase tracking-widest"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-primary hover:glow-red transition-all disabled:opacity-50 glass border border-primary/10"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 text-center text-[7px] font-mono text-primary/30 uppercase tracking-[0.5em]">
                SICI_NEURAL_LINK_v4.2.0_STABLE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 md:w-20 md:h-20 glass border border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(211,29,36,0.3)] glow-red group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/10 animate-pulse" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        {isOpen ? (
          <X className="w-8 h-8 md:w-10 md:h-10 text-primary relative z-10" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <Bot className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[6px] font-mono text-primary mt-1 uppercase tracking-widest opacity-60">LINK</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
