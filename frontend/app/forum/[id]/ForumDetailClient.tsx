'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Clock, TrendingUp, Eye, ChevronUp, ChevronDown, Flag, Share2, Star, Send, ShieldCheck, Camera, Image as ImageIcon, X, Reply } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createForumAnswer, markAnswerAccepted } from '@/lib/actions/forum';
import { toggleLike } from '@/lib/actions/likes';

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[] | null;
  views: number;
  likes: number;
  isSolved: boolean;
  featuredAnswerId: string | null;
  createdAt: Date;
  authorName: string | null;
  authorId: string | null;
}

interface Answer {
  id: string;
  content: string;
  images: string[] | null;
  likes: number;
  parentReplyId: string | null;
  createdAt: Date;
  authorName: string | null;
  authorId: string | null;
}

export default function ForumDetailClient({ question, answers, currentUserId }: { question: Question; answers: Answer[]; currentUserId: string | null }) {
  const [featuredId, setFeaturedId] = useState(question.featuredAnswerId);
  const [replyContent, setReplyContent] = useState('');
  const [replyImages, setReplyImages] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<Answer | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isQuestionAuthor = !!currentUserId && currentUserId === question.authorId;
  const topLevelAnswers = answers.filter((a) => !a.parentReplyId);
  const repliesByParent = new Map<string, Answer[]>();
  for (const a of answers) {
    if (a.parentReplyId) {
      repliesByParent.set(a.parentReplyId, [...(repliesByParent.get(a.parentReplyId) || []), a]);
    }
  }

  const handleAccept = async (answerId: string) => {
    setFeaturedId(answerId);
    await markAnswerAccepted(question.id, answerId);
  };

  const handleLikeAnswer = async (answerId: string) => {
    await toggleLike('forum_answer', answerId);
  };

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

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await createForumAnswer({
        questionId: question.id,
        content: replyContent,
        images: replyImages.length > 0 ? replyImages : undefined,
        parentReplyId: replyingTo?.id,
      });
      setReplyContent('');
      setReplyImages([]);
      setReplyingTo(null);
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  return (
    <>
      {/* Breadcrumbs / Back */}
      <div className="mb-12 flex items-center justify-between">
        <Link href="/forum" className="inline-flex items-center gap-2 text-[10px] font-mono text-primary hover:glow-red transition-all uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3" /> VOLVER_AL_FORO
        </Link>
        <div className="hud-tag text-primary">THREAD_ID: {question.id.slice(0, 8)}</div>
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
              <Clock className="w-3 h-3 text-primary" /> Preguntado: <span className="text-white">{question.createdAt.toLocaleDateString()}</span>
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
              onClick={() => toggleLike('forum_question', question.id)}
              disabled={!currentUserId}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all group disabled:opacity-40"
            >
              <ChevronUp className="w-6 h-6 group-hover:glow-red" />
            </button>
            <div className="text-2xl font-display font-bold text-white">{question.likes}</div>
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

            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {question.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono text-primary border border-primary/20 px-3 py-1 bg-primary/5 uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-white/5">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-[9px] font-mono text-secondary/50 hover:text-primary transition-colors uppercase tracking-widest">
                  <Share2 className="w-3 h-3" /> Compartir
                </button>
                <button className="flex items-center gap-2 text-[9px] font-mono text-secondary/50 hover:text-primary transition-colors uppercase tracking-widest">
                  <Flag className="w-3 h-3" /> Reportar
                </button>
              </div>

              {question.authorId && (
                <Link href={`/profile/${question.authorId}`} className="glass p-4 cyber-border border-primary/20 bg-primary/5 flex items-center gap-4 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-sm bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-primary/60 uppercase tracking-widest">Preguntado por</div>
                    <div className="text-xs font-display font-bold text-white uppercase">{question.authorName || 'Anónimo'}</div>
                    <div className="text-[8px] font-mono text-secondary/40 uppercase">{question.createdAt.toLocaleDateString()}</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="space-y-12 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-bold uppercase tracking-tighter text-white">
              {answers.length} Respuestas
            </h2>
          </div>

          <div className="space-y-12">
            {topLevelAnswers.map((answer, idx) => {
              const isFeatured = featuredId === answer.id;
              const replies = repliesByParent.get(answer.id) || [];

              return (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-6"
                >
                  <div className={`flex gap-6 md:gap-8 p-6 rounded-sm transition-all ${isFeatured ? 'bg-primary/5 border border-primary/20 glow-red' : ''}`}>
                    {/* Answer Voting */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleLikeAnswer(answer.id)}
                        disabled={!currentUserId}
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all disabled:opacity-40"
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <div className="text-xl font-display font-bold text-secondary">{answer.likes}</div>

                      {isFeatured && (
                        <div className="mt-4 text-primary animate-pulse" title="Respuesta Destacada">
                          <Star className="w-6 h-6 fill-primary" />
                        </div>
                      )}

                      {isQuestionAuthor && !isFeatured && (
                        <button
                          onClick={() => handleAccept(answer.id)}
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

                      <div className="flex items-center justify-between gap-4">
                        {currentUserId && (
                          <button
                            onClick={() => setReplyingTo(answer)}
                            className="flex items-center gap-2 text-[9px] font-mono text-secondary/50 hover:text-primary transition-colors uppercase tracking-widest"
                          >
                            <Reply className="w-3 h-3" /> Responder
                          </button>
                        )}
                        {answer.authorId && (
                          <Link href={`/profile/${answer.authorId}`} className="text-right hover:text-primary transition-colors cursor-pointer ml-auto flex items-center gap-4">
                            <div>
                              <div className="text-[8px] font-mono text-secondary/40 uppercase tracking-widest">Respondido por</div>
                              <div className="text-xs font-display font-bold text-primary uppercase">{answer.authorName || 'Anónimo'}</div>
                              <div className="text-[8px] font-mono text-secondary/40 uppercase">{answer.createdAt.toLocaleDateString()}</div>
                            </div>
                            <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-secondary" />
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nivel 2: respuestas a esta respuesta */}
                  {replies.length > 0 && (
                    <div className="ml-16 md:ml-24 space-y-4 border-l border-white/10 pl-6">
                      {replies.map((reply) => (
                        <div key={reply.id} className="flex gap-4 items-start">
                          <button
                            onClick={() => handleLikeAnswer(reply.id)}
                            disabled={!currentUserId}
                            className="flex flex-col items-center shrink-0 text-secondary/50 hover:text-primary transition-colors disabled:opacity-40"
                          >
                            <ChevronUp className="w-4 h-4" />
                            <span className="text-xs font-mono">{reply.likes}</span>
                          </button>
                          <div className="flex-grow bg-white/5 p-4 rounded-sm">
                            <p className="text-sm text-secondary/90 leading-relaxed">{reply.content}</p>
                            <div className="text-[8px] font-mono text-secondary/40 uppercase tracking-widest mt-2">
                              {reply.authorName || 'Anónimo'} · {reply.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {topLevelAnswers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary font-mono text-sm uppercase tracking-widest">
                Aún no hay respuestas. ¡Sé el primero en responder!
              </p>
            </div>
          )}

          {/* Reply Form */}
          <div className="glass p-8 md:p-12 cyber-border relative overflow-hidden mt-20">
            <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">REPLY_MODULE_V2</div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight text-white">
                {replyingTo ? `Respondiendo a ${replyingTo.authorName || 'Anónimo'}` : 'Tu Respuesta'}
              </h3>
              {replyingTo && (
                <button type="button" onClick={() => setReplyingTo(null)} className="text-[9px] font-mono text-secondary/50 hover:text-primary uppercase tracking-widest">
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-6">
              <div className="relative">
                <textarea 
                  rows={8}
                  placeholder="Escribe tu respuesta técnica aquí..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
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
    </>
  );
}
