'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnrollmentModal from '@/components/EnrollmentModal';
import { Clock, GraduationCap, ArrowLeft, CheckCircle2, User, Info, BookOpen, Calendar, Zap, ChevronDown, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: string;
  name: string;
  description: string;
  duration: string | null;
  syllabus: any;
  category: string | null;
  status: string;
  image: string | null;
  gallery: string[] | null;
  objective: string | null;
  results: string | null;
  relevantInfo: string | null;
  createdAt: Date;
  instructorId: string | null;
  mentorSpecialty: string | null;
  mentorExperience: string | null;
  instructorName: string | null;
  instructorAvatar: string | null;
  mentorUserId: string | null;
}

export default function CourseDetailClient({ course }: { course: Course }) {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const syllabusArray = Array.isArray(course.syllabus) ? course.syllabus : [];
  const galleryArray = Array.isArray(course.gallery) ? course.gallery : [];

  return (
    <>
      {/* Back Button */}
      <div className="mb-12">
        <Link href="/mentors" className="inline-flex items-center gap-2 text-primary hover:glow-red transition-all font-mono text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Volver_a_Programas
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Course Info */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="hud-tag mb-6 inline-block">SICI_ACADEMY // COURSE_DETAIL</div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 uppercase leading-tight tracking-tighter">
              {course.name}
            </h1>
            <p className="text-xl text-secondary font-body leading-relaxed opacity-80 mb-12">
              {course.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-primary/50 uppercase">Duración</div>
                  <div className="text-sm font-display uppercase">{course.duration || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-primary/50 uppercase">Certificación</div>
                  <div className="text-sm font-display uppercase">Oficial SICI</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-primary/50 uppercase">Nivel</div>
                  <div className="text-sm font-display uppercase">Intermedio</div>
                </div>
              </div>
            </div>
          </div>

          {/* Objective & Results Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {course.objective && (
              <div className="glass p-8 cyber-border border-primary/10">
                <h3 className="text-primary font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Objetivo_del_Curso
                </h3>
                <p className="text-secondary font-body text-sm leading-relaxed opacity-80">
                  {course.objective}
                </p>
              </div>
            )}

            {course.results && (
              <div className="glass p-8 cyber-border border-primary/10">
                <h3 className="text-primary font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Resultados_Esperados
                </h3>
                <p className="text-secondary font-body text-sm leading-relaxed opacity-80">
                  {course.results}
                </p>
              </div>
            )}
          </div>

          {/* Syllabus Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Contenido del Curso</h2>
              </div>
              <div className="text-[10px] font-mono text-secondary/50 uppercase tracking-widest">
                {syllabusArray.length} Módulos
              </div>
            </div>
            
            <div className="space-y-2">
              {syllabusArray.map((module: any, i: number) => (
                <div key={i} className="glass cyber-border overflow-hidden">
                  <button 
                    onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                    className="w-full p-6 flex items-center justify-between group hover:bg-white/5 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-primary/40">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-lg font-display uppercase tracking-tight group-hover:text-primary transition-colors">
                        {module.title}
                      </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${expandedModule === i ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedModule === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 space-y-3 border-t border-white/5 pt-4">
                          {module.lessons && module.lessons.map((lesson: string, j: number) => (
                            <div key={j} className="flex items-center gap-3 text-xs font-body text-secondary/70 hover:text-white transition-colors">
                              <PlayCircle className="w-4 h-4 text-primary/40" />
                              {lesson}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Course Gallery */}
          {course.status === 'finished' && galleryArray.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Galería del Curso</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryArray.map((img, i) => (
                  <div key={i} className="relative aspect-video glass cyber-border overflow-hidden group">
                    <Image 
                      src={img}
                      alt={`Gallery image ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-[10px] font-mono text-white uppercase tracking-widest">SICI_EVENT_LOG // IMG_{i+1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relevant Info */}
          {course.relevantInfo && (
            <div className="glass p-8 cyber-border bg-primary/5 border-primary/20">
              <div className="flex items-center gap-4 mb-6">
                <Info className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-display font-bold uppercase tracking-tight text-primary">Información Relevante</h2>
              </div>
              <p className="text-secondary font-body leading-relaxed opacity-90">
                {course.relevantInfo}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Enrollment & Instructor */}
        <div className="lg:col-span-1 space-y-8">
          {/* Enrollment Card */}
          <div className={`glass p-8 cyber-border sticky top-32 ${course.status === 'finished' ? 'border-secondary/20' : ''}`}>
            <div className="text-center mb-8">
              <div className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-2 ${course.status === 'finished' ? 'text-secondary' : 'text-primary'}`}>
                {course.status === 'finished' ? 'CICLO_FINALIZADO' : 'Inscripción_Abierta'}
              </div>
              <div className="text-4xl font-display font-bold text-white mb-2">
                {course.status === 'finished' ? 'CERRADO' : 'GRATUITO'}
              </div>
              <div className="text-[10px] font-mono text-secondary uppercase">
                {course.status === 'finished' ? 'Próximamente nueva edición' : 'Para miembros activos SICI'}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                'Acceso de por vida',
                'Certificado digital',
                'Material de estudio',
                'Sesiones de mentoría Q&A'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-body text-secondary">
                  <CheckCircle2 className={`w-4 h-4 ${course.status === 'finished' ? 'text-secondary/40' : 'text-primary'}`} />
                  {feature}
                </div>
              ))}
            </div>

            {course.status === 'active' ? (
              <button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="hud-button w-full py-4 text-sm mb-4"
              >
                INSCRIBIRME AHORA
              </button>
            ) : (
              <button className="w-full py-4 text-sm mb-4 border border-white/10 text-secondary/50 cursor-not-allowed font-mono uppercase tracking-widest">
                INSCRIPCIONES CERRADAS
              </button>
            )}
            
            <p className="text-[8px] font-mono text-center text-secondary/50 uppercase tracking-widest">
              {course.status === 'active' ? 'Sujeto a disponibilidad de cupos // Ciclo 2024-I' : 'Finalizado el 15 de Diciembre, 2023'}
            </p>
          </div>

          <EnrollmentModal 
            isOpen={isEnrollModalOpen} 
            onClose={() => setIsEnrollModalOpen(false)} 
            courseName={course.name} 
          />

          {/* Instructor Card */}
          <div className="glass p-6 cyber-border">
            <h4 className="text-xs font-mono text-primary uppercase mb-6 tracking-widest">Instructor_Asignado</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 relative cyber-border overflow-hidden">
                <Image 
                  src={course.instructorAvatar || 'https://picsum.photos/seed/user/200/200'}
                  alt={course.instructorName || 'Instructor'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-lg font-display font-bold uppercase tracking-tight">{course.instructorName || 'Por definir'}</div>
                <div className="text-[10px] font-mono text-primary/60 uppercase">{course.mentorSpecialty || ''}</div>
              </div>
            </div>
            {course.mentorExperience && (
              <p className="text-[11px] text-secondary font-body leading-relaxed opacity-70 mb-6">
                {course.mentorExperience}
              </p>
            )}
            {course.mentorUserId && (
              <Link 
                href={`/profile/${course.mentorUserId}`}
                className="text-[10px] font-mono text-primary hover:underline uppercase tracking-widest flex items-center gap-2"
              >
                Ver Perfil Completo <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
