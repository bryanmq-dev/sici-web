import React from 'react';
import { ChevronUp, ChevronDown, Eye, User } from 'lucide-react';
import { Question } from '@/lib/data';
import Image from 'next/image';

export default function QuestionCard({ question }: { question: Question }) {
  return (
    <article className="bg-surface p-8 rounded-xl border border-border hover:border-primary/30 transition-all group relative overflow-hidden">
      <div className="flex gap-8 relative z-10">
        {/* Voting & Stats */}
        <div className="flex flex-col items-center gap-6 text-text-muted min-w-[70px]">
          <div className="flex flex-col items-center bg-surface-muted p-2 rounded-lg border border-border">
            <button className="hover:text-primary transition-colors p-1">
              <ChevronUp className="w-6 h-6" />
            </button>
            <span className="font-display font-bold text-xl text-text-primary my-1">{question.likes}</span>
            <button className="hover:text-primary transition-colors p-1">
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-primary">{question.answers.length}</div>
            <div className="text-[8px] font-bold uppercase tracking-widest text-text-muted">Respuestas</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-display font-bold text-text-primary group-hover:text-primary transition-colors cursor-pointer leading-tight">
            {question.title}
          </h2>
          <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed font-body">
            {question.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {question.tags.map(tag => (
              <span key={tag} className="badge-secondary text-[10px] font-bold uppercase tracking-widest hover:border-primary/30 transition-colors">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 text-[10px] font-bold uppercase tracking-widest text-text-muted border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center border border-border overflow-hidden relative">
                <User className="w-4 h-4 text-text-muted" />
              </div>
              <div className="flex flex-col">
                <span className="text-text-primary">{question.author}</span>
                <span className="opacity-50">preguntó hace {question.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> 1.2k
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
