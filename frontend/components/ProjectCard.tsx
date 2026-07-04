import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Project } from '@/lib/data';
import LikeButton from './LikeButton';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card flex flex-col h-full overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 2).map(tag => (
            <span key={tag} className="badge-primary text-[11px]">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {project.title}
          </h3>
        </Link>
        
        <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-grow">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center">
              <User className="w-4 h-4 text-text-muted" />
            </div>
            <div className="flex flex-col">
              <Link href={`/profile/${project.authorId}`}>
                <span className="text-xs font-medium text-text-primary hover:text-primary transition-colors">
                  {project.author}
                </span>
              </Link>
              <span className="text-[11px] text-text-muted">{project.date}</span>
            </div>
          </div>
          <LikeButton initialLikes={project.likes} />
        </div>
      </div>
    </div>
  );
}
