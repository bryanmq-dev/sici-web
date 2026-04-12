'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/lib/data';
import { Clock, BookOpen, ArrowRight, User } from 'lucide-react';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-surface-container-low rounded-sm overflow-hidden group hover:border-primary/30 transition-all duration-500 flex flex-col h-full border border-white/5 relative">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={course.image}
          alt={course.name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          <span className="hud-badge hud-badge-primary">
            {course.duration}
          </span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary glow-red animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">En Vivo</span>
          </div>
          <div className="text-[10px] text-outline font-bold uppercase tracking-widest">ID: {course.id.toUpperCase()}</div>
        </div>

        <Link href={`/courses/${course.id}`}>
          <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight uppercase tracking-tighter">
            {course.name}
          </h3>
        </Link>
        
        <p className="text-secondary text-sm mb-6 line-clamp-2 flex-grow font-body leading-relaxed">
          {course.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-3 bg-surface-container-high border border-white/5 rounded-sm">
            <div className="text-[10px] text-outline font-bold uppercase tracking-widest mb-1">Duración</div>
            <div className="text-xs font-bold text-on-surface">{course.duration}</div>
          </div>
          <div className="p-3 bg-surface-container-high border border-white/5 rounded-sm">
            <div className="text-[10px] text-outline font-bold uppercase tracking-widest mb-1">Módulos</div>
            <div className="text-xs font-bold text-on-surface">{course.syllabus.length} Unidades</div>
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-sm border-l-2 border-primary mb-8">
          <p className="text-[10px] text-primary font-bold italic line-clamp-2 leading-relaxed">
            &quot;{course.relevantInfo}&quot;
          </p>
        </div>
        
        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-sm bg-surface-container-highest flex items-center justify-center border border-white/5 overflow-hidden">
                <User className="w-4 h-4 text-outline" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-outline font-bold uppercase tracking-widest">Instructor</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{course.instructorName}</span>
              </div>
            </div>
            
            <Link 
              href={`/courses/${course.id}`}
              className="px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/80 transition-all glow-red"
            >
              Inscribirse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
