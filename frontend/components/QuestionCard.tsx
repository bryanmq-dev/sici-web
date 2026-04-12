import React from 'react';
import { ChevronUp, ChevronDown, Eye, User } from 'lucide-react';
import { Question } from '@/lib/data';
import Image from 'next/image';

export default function QuestionCard({ question }: { question: Question }) {
  return (
    <article className="bg-surface-container-low p-8 rounded-sm border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
      
      <div className="flex gap-8 relative z-10">
        {/* Voting & Stats */}
        <div className="flex flex-col items-center gap-6 text-outline min-w-[70px]">
          <div className="flex flex-col items-center bg-surface-container-high p-2 rounded-sm border border-white/5">
            <button className="hover:text-primary transition-colors p-1">
              <ChevronUp className="w-6 h-6" />
            </button>
            <span className="font-display font-bold text-xl text-white my-1">{question.likes}</span>
            <button className="hover:text-primary transition-colors p-1">
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-primary glow-red">{question.answers.length}</div>
            <div className="text-[8px] font-bold uppercase tracking-widest text-outline">Respuestas</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors cursor-pointer leading-tight">
            {question.title}
          </h2>
          <p className="text-secondary text-sm line-clamp-2 leading-relaxed font-body">
            {question.description}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {question.tags.map(tag => (
              <span key={tag} className="bg-surface-container-highest px-3 py-1 rounded-sm text-[10px] font-bold text-outline uppercase tracking-widest border border-white/5 hover:border-primary/30 transition-colors">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 text-[10px] font-bold uppercase tracking-widest text-outline border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-surface-container-highest flex items-center justify-center border border-white/5 overflow-hidden relative">
                <User className="w-4 h-4 text-outline" />
              </div>
              <div className="flex flex-col">
                <span className="text-white">{question.author}</span>
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
