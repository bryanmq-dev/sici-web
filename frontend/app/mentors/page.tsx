'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MentorCard from '@/components/MentorCard';
import { mentors, courses } from '@/lib/data';
import Image from 'next/image';
import { Shield, Cpu, Globe, Zap, User, Star, MessageSquare, ArrowUpRight, BookOpen, Clock, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function MentorsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hud-tag mb-4 inline-block">Mentorship_Program_v1.5</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Red de <span className="text-primary glow-red">Mentores</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Aprende de los mejores. Nuestra red de mentores incluye docentes expertos y estudiantes destacados con experiencia real en la industria.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            {mentors.map((mentor, idx) => (
              <MentorCard key={mentor.id} mentor={mentor} index={idx} />
            ))}
          </div>

          {/* Courses Section */}
          <div className="mt-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-px bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Academy_Programs</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-16 tracking-tighter uppercase">Cursos <span className="text-primary glow-red">Disponibles</span></h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass cyber-border group relative overflow-hidden flex flex-col"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image 
                      src={course.image} 
                      alt={course.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                    <div className="absolute top-4 right-4 hud-tag bg-black/80 backdrop-blur-md border-primary/30 text-[8px]">
                      COURSE_ID: {course.id}
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-1 bg-primary" />
                      <Link href={`/profile/${course.instructorId}`} className="text-[8px] font-mono text-primary uppercase tracking-widest hover:text-white transition-colors cursor-pointer">
                        Dictado por: {course.instructorName}
                      </Link>
                    </div>
                    
                    <h3 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors leading-tight mb-4 line-clamp-2">
                      {course.name}
                    </h3>
                    
                    <p className="text-secondary text-xs font-body leading-relaxed opacity-70 line-clamp-3 mb-8">
                      {course.description}
                    </p>

                    <div className="mt-auto space-y-6">
                      <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex items-center gap-2 text-[8px] font-mono text-outline uppercase tracking-widest">
                          <Clock className="w-3 h-3 text-primary" /> {course.duration}
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-mono text-outline uppercase tracking-widest">
                          <GraduationCap className="w-3 h-3 text-primary" /> Certificado_SICI
                        </div>
                      </div>

                      <Link 
                        href={`/courses/${course.id}`}
                        className="hud-button w-full text-center text-[10px] py-3 flex items-center justify-center gap-2"
                      >
                        Explorar Programa
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
