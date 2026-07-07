'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, User, Clock, Eye, ChevronUp, Flag, Share2, Star, Send, Camera, Image as ImageIcon, X, Reply, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createForumAnswer, markAnswerAccepted } from '@/lib/actions/forum';
import { toggleLike } from '@/lib/actions/likes';
import { getErrorMessage } from '@/lib/utils';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const router = useRouter();

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    if (!currentUserId) {
      router.push('/login');
      return;
    }
    setIsSubmitting(true);
    setError('');

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
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Breadcrumbs / Back */}
      <div className="mb-8">
        <Link href="/forum" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al foro
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Question Header */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
            {question.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-text-muted border-b border-border pb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Preguntado: {question.createdAt.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> {question.views} vistas
            </div>
          </div>
        </div>

        {/* Main Question Body */}
        <div className="flex gap-6">
          {/* Voting Sidebar */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <button
              onClick={() => toggleLike('forum_question', question.id)}
              disabled={!currentUserId}
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div className="text-xl font-bold text-text-primary">{question.likes}</div>
            <button className="text-text-muted hover:text-primary transition-colors">
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-grow space-y-6">
            <div className="card p-6 md:p-8">
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {question.description}
              </p>
            </div>

            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {question.tags.map(tag => (
                  <span key={tag} className="badge-secondary">{tag}</span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Compartir
                </button>
                <button className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
                  <Flag className="w-3.5 h-3.5" /> Reportar
                </button>
              </div>

              {question.authorId && (
                <Link href={`/profile/${question.authorId}`} className="card p-3 flex items-center gap-3 hover:border-primary/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-text-muted">Preguntado por</div>
                    <div className="text-sm font-medium text-text-primary">{question.authorName || 'Anónimo'}</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="space-y-8 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {answers.length} Respuesta{answers.length === 1 ? '' : 's'}
          </h2>

          <div className="space-y-8">
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
                  className="space-y-4"
                >
                  <div className={`flex gap-6 p-5 rounded-lg transition-colors ${isFeatured ? 'bg-primary/5 border border-primary/20' : 'card'}`}>
                    {/* Answer Voting */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleLikeAnswer(answer.id)}
                        disabled={!currentUserId}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <div className="text-lg font-semibold text-text-secondary">{answer.likes}</div>

                      {isFeatured && (
                        <div className="mt-2 text-primary" title="Respuesta destacada">
                          <Star className="w-5 h-5 fill-primary" />
                        </div>
                      )}

                      {isQuestionAuthor && !isFeatured && (
                        <button
                          onClick={() => handleAccept(answer.id)}
                          className="mt-2 text-text-muted hover:text-primary transition-colors"
                          title="Marcar como destacada"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-grow space-y-4">
                      {isFeatured && (
                        <div className="text-xs font-medium text-primary flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-primary" /> Respuesta destacada por el autor
                        </div>
                      )}
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {answer.content}
                      </p>

                      {answer.images && answer.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {answer.images.map((img, i) => (
                            <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                              <Image src={img} alt={`Imagen ${i + 1}`} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-4">
                        {currentUserId && (
                          <button
                            onClick={() => setReplyingTo(answer)}
                            className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors"
                          >
                            <Reply className="w-3.5 h-3.5" /> Responder
                          </button>
                        )}
                        {answer.authorId && (
                          <Link href={`/profile/${answer.authorId}`} className="text-right hover:text-primary transition-colors ml-auto flex items-center gap-3">
                            <div>
                              <div className="text-xs font-medium text-text-primary">{answer.authorName || 'Anónimo'}</div>
                              <div className="text-xs text-text-muted">{answer.createdAt.toLocaleDateString()}</div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
                              <User className="w-4 h-4 text-text-muted" />
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nivel 2: respuestas a esta respuesta */}
                  {replies.length > 0 && (
                    <div className="ml-14 space-y-3 border-l border-border pl-6">
                      {replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 items-start">
                          <button
                            onClick={() => handleLikeAnswer(reply.id)}
                            disabled={!currentUserId}
                            className="flex flex-col items-center shrink-0 text-text-muted hover:text-primary transition-colors disabled:opacity-40"
                          >
                            <ChevronUp className="w-4 h-4" />
                            <span className="text-xs">{reply.likes}</span>
                          </button>
                          <div className="flex-grow bg-surface-muted p-3 rounded-lg">
                            <p className="text-sm text-text-secondary leading-relaxed">{reply.content}</p>
                            <div className="text-xs text-text-muted mt-1.5">
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
              <p className="text-text-muted text-sm">Aún no hay respuestas. ¡Sé el primero en responder!</p>
            </div>
          )}

          {/* Reply Form */}
          <div className="card p-6 md:p-8 mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">
                {replyingTo ? `Respondiendo a ${replyingTo.authorName || 'Anónimo'}` : 'Tu Respuesta'}
              </h3>
              {replyingTo && (
                <button type="button" onClick={() => setReplyingTo(null)} className="text-sm text-text-muted hover:text-primary">
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-5">
              <textarea
                rows={6}
                placeholder="Escribe tu respuesta técnica aquí..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="textarea"
              />

              {/* Image Upload Preview */}
              {replyImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {replyImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                      <Image src={img} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
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
                  className="btn-secondary py-2 text-sm disabled:opacity-50"
                >
                  <Camera className="w-3.5 h-3.5" /> {isUploading ? 'Subiendo...' : replyImages.length > 0 ? 'Añadir otra imagen' : 'Subir imagen'}
                </button>

                {replyImages.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <ImageIcon className="w-3.5 h-3.5" /> {replyImages.length} archivo{replyImages.length === 1 ? '' : 's'}
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting} className="btn-primary py-3">
                  {isSubmitting ? 'Publicando...' : 'Publicar Respuesta'}
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
