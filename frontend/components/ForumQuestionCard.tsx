'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { User, ArrowUpRight } from 'lucide-react';
import { Question } from '@/lib/data';

interface ForumQuestionCardProps {
  question: Question;
  index: number;
}

export default function ForumQuestionCard({ question, index }: ForumQuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass cyber-border group hover:bg-primary/5 transition-all"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Stats Section (StackOverflow Style) */}
        <div className="sm:w-32 p-6 flex sm:flex-col items-center justify-center gap-4 sm:gap-6 border-b sm:border-b-0 sm:border-r border-outline/5 bg-surface-container-low/50">
          <div className="text-center">
            <div className={`text-lg font-display font-bold ${question.likes > 0 ? 'text-primary' : question.likes < 0 ? 'text-red-500' : 'text-secondary'}`}>
              {question.likes}
            </div>
            <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest">Votos</div>
          </div>
          <div className={`text-center p-2 rounded-sm border ${question.answers.length > 0 ? 'border-primary/30 bg-primary/5' : 'border-transparent'}`}>
            <div className={`text-lg font-display font-bold ${question.answers.length > 0 ? 'text-primary' : 'text-secondary'}`}>
              {question.answers.length}
            </div>
            <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest">Respuestas</div>
          </div>
          <div className="text-center opacity-40">
            <div className="text-xs font-display font-bold text-secondary">
              {question.views}
            </div>
            <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest">Vistas</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Link href={`/forum/${question.id}`}>
              <h2 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors leading-tight text-on-surface">
                {question.title}
              </h2>
            </Link>
            <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all shrink-0" />
          </div>
          
          <p className="text-secondary text-xs font-body leading-relaxed opacity-60 line-clamp-2">
            {question.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div className="flex flex-wrap gap-2">
              {question.tags.map(tag => (
                <span key={tag} className="hud-badge hud-badge-primary">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
              </div>
              <Link href={`/profile/${question.authorId}`} className="text-right hover:text-primary transition-colors cursor-pointer">
                <div className="text-[9px] font-mono text-on-surface uppercase">{question.author}</div>
                <div className="text-[8px] font-mono text-secondary/50 uppercase">{question.date}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
