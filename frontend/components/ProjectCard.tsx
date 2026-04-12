import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag } from 'lucide-react';
import { Project } from '@/lib/data';
import LikeButton from './LikeButton';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="glass border border-primary/10 hover:border-primary/40 transition-all duration-500 flex flex-col h-full relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-primary/20 group-hover:border-primary/60 transition-colors z-20" />
      
      <div className="relative h-64 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        
        {/* HUD Elements on Image */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <div className="text-[8px] font-mono text-primary/60 uppercase tracking-widest bg-background/40 backdrop-blur-md px-2 py-1 border border-primary/20">
            PRJ_ID: {project.id.slice(0, 8)}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
          {project.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] px-3 py-1 bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow relative z-10 bg-background/40 backdrop-blur-sm">
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-xl font-display font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight text-on-surface uppercase tracking-tight">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-secondary text-sm mb-8 line-clamp-3 flex-grow font-body leading-relaxed opacity-70">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/10">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 glass flex items-center justify-center border border-primary/10 overflow-hidden relative group-hover:border-primary/30 transition-colors">
              <User className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex flex-col">
              <Link href={`/profile/${project.authorId}`}>
                <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">{project.author}</span>
              </Link>
              <span className="text-[8px] text-primary/40 font-mono uppercase tracking-[0.3em]">{project.date}</span>
            </div>
          </div>
          <LikeButton initialLikes={project.likes} />
        </div>
      </div>
      
      {/* Hover Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-b from-transparent via-primary to-transparent bg-[length:100%_4px] animate-scanline-move" />
    </div>
  );
}
