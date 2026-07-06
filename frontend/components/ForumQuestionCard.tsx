'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { User, ArrowUpRight, ThumbsUp, Eye } from 'lucide-react';

interface ForumQuestionCardProps {
  question: {
    id: string;
    title: string;
    description: string;
    tags: string[] | null;
    views: number;
    likes: number;
    isSolved: boolean;
    createdAt: Date;
    authorName: string | null;
    authorId: string | null;
  };
  index: number;
}

export default function ForumQuestionCard({ question, index }: ForumQuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card group hover:border-primary/30 transition-all"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-28 p-4 flex sm:flex-col items-center justify-center gap-4 sm:gap-3 border-b sm:border-b-0 sm:border-r border-border bg-surface-muted">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
            <ThumbsUp className="w-3.5 h-3.5 text-primary" /> {question.likes}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Eye className="w-3.5 h-3.5" /> {question.views}
          </div>
        </div>

        <div className="flex-grow p-5 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Link href={`/forum/${question.id}`}>
              <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">
                {question.title}
              </h2>
            </Link>
            <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>

          <p className="text-sm text-text-secondary line-clamp-2">
            {question.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {(question.tags || []).map(tag => (
                <span key={tag} className="badge-secondary">{tag}</span>
              ))}
              {question.isSolved && <span className="badge-success">Resuelta</span>}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <Link href={`/profile/${question.authorId}`} className="hover:text-primary transition-colors">
                <div className="text-xs font-medium text-text-primary">{question.authorName || 'Anónimo'}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
