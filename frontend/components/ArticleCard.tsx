import React from 'react';
import Link from 'next/link';
import { FileText, Download, Calendar, Tag } from 'lucide-react';
import { Article } from '@/lib/data';
import LikeButton from './LikeButton';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-surface-container-low p-8 rounded-sm border border-outline/10 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="p-3 bg-primary-container/20 rounded-sm group-hover:bg-primary-container/30 transition-colors border border-primary/20">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <LikeButton initialLikes={article.likes} />
      </div>
      
      <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors leading-tight relative z-10">
        {article.title}
      </h3>
      
      <p className="text-outline text-[10px] font-bold uppercase tracking-widest mb-4 relative z-10">
        {article.authors.map((author, index) => (
          <React.Fragment key={index}>
            {article.authorIds && article.authorIds[index] ? (
              <Link href={`/profile/${article.authorIds[index]}`} className="hover:text-primary transition-colors cursor-pointer">
                {author}
              </Link>
            ) : (
              <span>{author}</span>
            )}
            {index < article.authors.length - 1 && ' • '}
          </React.Fragment>
        ))}
      </p>
      
      <p className="text-secondary text-sm mb-8 line-clamp-3 font-body leading-relaxed relative z-10">
        {article.abstract}
      </p>
      
      <div className="flex items-center justify-between pt-6 border-t border-outline/10 relative z-10">
        <div className="flex items-center space-x-2">
          <Tag className="w-3 h-3 text-primary" />
          <span className="hud-tag">{article.researchArea}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-[10px] text-outline font-bold uppercase tracking-widest flex items-center">
            <Calendar className="w-3 h-3 mr-2 text-primary" />
            {article.date}
          </span>
          <a 
            href={article.pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-surface-container-highest rounded-sm hover:bg-primary-container transition-colors border border-outline/10"
          >
            <Download className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
}
