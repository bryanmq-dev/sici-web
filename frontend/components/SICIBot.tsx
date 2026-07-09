'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot } from 'lucide-react';
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 md:absolute md:inset-auto md:bottom-24 md:right-0 w-full h-full md:w-[400px] md:h-[600px] bg-background/95 backdrop-blur-md border border-border rounded-xl flex flex-col overflow-hidden shadow-2xl z-[101]"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-display font-semibold text-text-primary">SICI-Bot</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-[11px] text-text-muted">En línea</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 bg-background"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 text-sm leading-relaxed rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-surface border border-border text-text-primary'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface border border-border rounded-lg p-3">
                    <div className="flex gap-1.5">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-surface">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu consulta..."
                  className="input pr-10"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
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
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
