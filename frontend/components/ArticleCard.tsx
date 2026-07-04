import React from 'react';
import Link from 'next/link';
import { FileText, Download, Calendar } from 'lucide-react';
import { Article } from '@/lib/data';
import LikeButton from './LikeButton';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="card p-5 group flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary-light/50 rounded-lg">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <LikeButton initialLikes={article.likes} />
      </div>
      
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
        {article.title}
      </h3>
      
      <div className="text-xs text-text-muted mb-3">
        {article.authors.map((author, index) => (
          <React.Fragment key={index}>
            {article.authorIds && article.authorIds[index] ? (
              <Link href={`/profile/${article.authorIds[index]}`} className="hover:text-primary transition-colors">
                {author}
              </Link>
            ) : (
              <span>{author}</span>
            )}
            {index < article.authors.length - 1 && ' · '}
          </React.Fragment>
        ))}
      </div>
      
      <p className="text-sm text-text-secondary mb-4 line-clamp-3 flex-grow">
        {article.abstract}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-2">
          <span className="badge-secondary text-[11px]">{article.researchArea}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <a 
            href={article.pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            title="Descargar PDF"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
