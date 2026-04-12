'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Mentor } from '@/lib/data';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface MentorCarouselProps {
  mentors: Mentor[];
  title: string;
}

export default function MentorCarousel({ mentors, title }: MentorCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % mentors.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + mentors.length) % mentors.length);
  };

  return (
    <div className="mb-24">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-px bg-primary" />
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prev}
            className="p-2 bg-surface-container-high border border-white/5 hover:border-primary/30 transition-all text-outline hover:text-primary"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={next}
            className="p-2 bg-surface-container-high border border-white/5 hover:border-primary/30 transition-all text-outline hover:text-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {mentors.map((mentor) => (
            <div key={mentor.id} className="w-full flex-shrink-0 px-2">
              <div className="bg-surface-container-low p-8 md:p-12 rounded-sm border border-white/5 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
                
                <div className="w-full md:w-1/3">
                  <div className="relative aspect-square rounded-sm overflow-hidden mb-6 border border-primary/20 group-hover:border-primary/50 transition-colors">
                    <Image
                      src={mentor.photo}
                      alt={mentor.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-display font-bold mb-2 uppercase tracking-tighter">{mentor.name}</h3>
                      <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">{mentor.specialty}</p>
                      <div className="flex items-center space-x-1 text-primary">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <div className="text-[10px] text-outline font-bold uppercase tracking-widest mb-1">Cursos</div>
                        <div className="text-xl font-display font-bold text-primary">{mentor.courseIds.length}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-outline font-bold uppercase tracking-widest mb-1">Exp.</div>
                        <div className="text-xl font-display font-bold text-primary">10+</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline">Biografía Profesional</h4>
                      <p className="text-secondary leading-relaxed font-body text-sm line-clamp-4">{mentor.experience}</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline">Especialidades Técnicas</h4>
                      <div className="space-y-3">
                        {mentor.skills.map((skill, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                              <span className="text-on-surface">{skill.name}</span>
                              <span className="text-primary">{skill.level}%</span>
                            </div>
                            <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className="h-full bg-primary glow-red"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border border-background bg-surface-container-highest overflow-hidden">
                            <Image src={`https://picsum.photos/seed/user${i}/50/50`} alt="User" width={24} height={24} className="grayscale" />
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] text-outline font-bold uppercase tracking-widest">
                        +150 Estudiantes guiados
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-primary/10 border border-primary/30 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">
                      Ver Perfil Completo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
