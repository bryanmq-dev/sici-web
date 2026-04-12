'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { questions } from '@/lib/data';
import { MessageSquare, Heart, Calendar, User, ArrowLeft, Send, ShieldCheck, MessageCircle, ArrowUpRight, Plus, ChevronUp, ChevronDown, Share2, Flag, Eye, Clock, CheckCircle2, Star, Camera, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForumDetailsPage() {
  const params = useParams();
  const question = questions.find(q => q.id === params.id);
  const [votes, setVotes] = useState(question?.likes || 0);
  const [featuredId, setFeaturedId] = useState(question?.featuredAnswerId);
  const [replyImages, setReplyImages] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock user check - in a real app this would come from an auth context
  const isQuestionAuthor = true; 

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setReplyImages([...replyImages, base64String]);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (url: string) => {
    setReplyImages(replyImages.filter(img => img !== url));
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold mb-4 uppercase tracking-tighter">Consulta no encontrada</h1>
            <Link href="/forum" className="hud-button">Volver al Foro</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs / Back */}
          <div className="mb-12 flex items-center justify-between">
            <Link href="/forum" className="inline-flex items-center gap-2 text-[10px] font-mono text-primary hover:glow-red transition-all uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3" /> VOLVER_AL_FORO
            </Link>
            <div className="hud-tag text-primary">THREAD_ID: {question.id}</div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Question Header */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter leading-tight text-white">
                {question.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-[10px] font-mono text-secondary/50 uppercase tracking-widest border-b border-white/10 pb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-primary" /> Preguntado: <span className="text-white">{question.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-primary" /> Activo: <span className="text-white">Hoy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3 text-primary" /> Visto: <span className="text-white">{question.views} veces</span>
                </div>
              </div>
            </div>

            {/* Main Question Body */}
            <div className="flex gap-6 md:gap-8">
              {/* Voting Sidebar */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <button 
                  onClick={() => setVotes(v => v + 1)}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all group"
                >
                  <ChevronUp className="w-6 h-6 group-hover:glow-red" />
                </button>
                <div className="text-2xl font-display font-bold text-white">{votes}</div>
                <button 
                  onClick={() => setVotes(v => v - 1)}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all group"
                >
                  <ChevronDown className="w-6 h-6 group-hover:glow-red" />
                </button>
                <button className="mt-4 text-secondary/30 hover:text-primary transition-colors">
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Question Content */}
              <div className="flex-grow space-y-8">
                <div className="glass p-8 md:p-10 cyber-border min-h-[200px]">
                  <p className="text-secondary text-lg font-body leading-relaxed opacity-90 whitespace-pre-wrap">
                    {question.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {question.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-mono text-primary border border-primary/20 px-3 py-1 bg-primary/5 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-white/5">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-[9px] font-mono text-secondary/50 hover:text-primary transition-colors uppercase tracking-widest">
                      <Share2 className="w-3 h-3" /> Compartir
                    </button>
                    <button className="flex items-center gap-2 text-[9px] font-mono text-secondary/50 hover:text-primary transition-colors uppercase tracking-widest">
                      <Flag className="w-3 h-3" /> Reportar
                    </button>
                  </div>

                  <Link href={`/profile/${question.authorId}`} className="glass p-4 cyber-border border-primary/20 bg-primary/5 flex items-center gap-4 hover:bg-primary/10 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-sm bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-[8px] font-mono text-primary/60 uppercase tracking-widest">Preguntado por</div>
                      <div className="text-xs font-display font-bold text-white uppercase">{question.author}</div>
                      <div className="text-[8px] font-mono text-secondary/40 uppercase">{question.date}</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-12 pt-12 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold uppercase tracking-tighter text-white">
                  {question.answers.length} Respuestas
                </h2>
                <div className="flex gap-4">
                  <button className="text-[10px] font-mono text-primary uppercase tracking-widest">Más Votadas</button>
                  <button className="text-[10px] font-mono text-secondary/50 uppercase tracking-widest">Más Antiguas</button>
                </div>
              </div>

              <div className="space-y-12">
                {question.answers.map((answer, idx) => {
                  const isFeatured = featuredId === answer.id;
                  
                  return (
                    <motion.div
                      key={answer.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex gap-6 md:gap-8 p-6 rounded-sm transition-all ${isFeatured ? 'bg-primary/5 border border-primary/20 glow-red' : ''}`}
                    >
                      {/* Answer Voting */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <div className="text-xl font-display font-bold text-secondary">{answer.likes}</div>
                        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all">
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        
                        {isFeatured && (
                          <div className="mt-4 text-primary animate-pulse" title="Respuesta Destacada">
                            <Star className="w-6 h-6 fill-primary" />
                          </div>
                        )}

                        {isQuestionAuthor && !isFeatured && (
                          <button 
                            onClick={() => setFeaturedId(answer.id)}
                            className="mt-4 text-secondary/30 hover:text-primary transition-colors" 
                            title="Marcar como destacada"
                          >
                            <Star className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-grow space-y-6">
                        {isFeatured && (
                          <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <Star className="w-3 h-3 fill-primary" /> Respuesta_Destacada_por_Autor
                          </div>
                        )}
                        <div className={`glass p-8 cyber-border ${isFeatured ? 'bg-primary/5 border-primary/30' : 'bg-white/5'}`}>
                          <p className="text-secondary text-base font-body leading-relaxed opacity-90 mb-6">
                            {answer.content}
                          </p>

                          {/* Answer Images */}
                          {answer.images && answer.images.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                              {answer.images.map((img, i) => (
                                <div key={i} className="relative aspect-video glass cyber-border overflow-hidden cursor-zoom-in">
                                  <Image 
                                    src={img}
                                    alt={`Answer image ${i + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-4">
                          <Link href={`/profile/${answer.authorId}`} className="text-right hover:text-primary transition-colors cursor-pointer">
                            <div className="text-[8px] font-mono text-secondary/40 uppercase tracking-widest">Respondido por</div>
                            <div className="text-xs font-display font-bold text-primary uppercase">{answer.author}</div>
                            <div className="text-[8px] font-mono text-secondary/40 uppercase">{answer.date}</div>
                          </Link>
                          <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-secondary" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <div className="glass p-8 md:p-12 cyber-border relative overflow-hidden mt-20">
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">REPLY_MODULE_V2</div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight text-white mb-8">Tu Respuesta</h3>
                
                <form className="space-y-6">
                  <div className="relative">
                    <textarea 
                      rows={8}
                      placeholder="Escribe tu respuesta técnica aquí..."
                      className="w-full bg-black/40 border border-white/10 p-6 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase resize-none"
                    />
                    <div className="absolute bottom-4 right-4 text-[8px] font-mono text-secondary/30 uppercase">Markdown_Supported</div>
                  </div>

                  {/* Image Upload Preview */}
                  {replyImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {replyImages.map((img, i) => (
                        <div key={i} className="relative aspect-square glass cyber-border overflow-hidden group">
                          <Image src={img} alt="Preview" fill className="object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeImage(img)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <input 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <button 
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-2 text-[10px] font-mono text-primary border border-primary/20 px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-all uppercase tracking-widest ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isUploading ? (
                        <>Subiendo...</>
                      ) : (
                        <>
                          <Camera className="w-3 h-3" /> {replyImages.length > 0 ? 'Añadir otra imagen' : 'Subir Imagen desde Equipo'}
                        </>
                      )}
                    </button>
                    
                    {replyImages.length > 0 && (
                      <div className="flex items-center gap-2 text-[8px] font-mono text-secondary/40 uppercase">
                        <ImageIcon className="w-3 h-3" /> {replyImages.length} Archivos listos para subir
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 max-w-md">
                      <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                      <p className="text-[9px] text-secondary font-mono leading-relaxed">
                        RECUERDA SEGUIR LOS PROTOCOLOS DE ÉTICA DE LA SICI. LAS RESPUESTAS DEBEN SER TÉCNICAS Y RESPETUOSAS.
                      </p>
                    </div>
                    
                    <button type="submit" className="hud-button px-12 py-5 flex items-center gap-3 w-full sm:w-auto">
                      Publicar Respuesta
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
