'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnrollmentModal from '@/components/EnrollmentModal';
import { courses, mentors } from '@/lib/data';
import { Clock, GraduationCap, ArrowLeft, CheckCircle2, User, Info, BookOpen, Calendar, Zap, ChevronDown, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);
  const instructor = mentors.find(m => m.id === course?.instructorId);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-display mb-4">CURSO NO ENCONTRADO</h1>
        <Link href="/mentors" className="hud-button">VOLVER A MENTORES</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link href="/mentors" className="inline-flex items-center gap-2 text-primary hover:glow-red transition-all font-mono text-xs uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Volver_a_Programas
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column: Course Info */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
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
                      <div className="text-sm font-display uppercase">{course.duration}</div>
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
              </motion.div>

              {/* Objective & Results Section */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass p-8 cyber-border border-primary/10"
                >
                  <h3 className="text-primary font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Objetivo_del_Curso
                  </h3>
                  <p className="text-secondary font-body text-sm leading-relaxed opacity-80">
                    {course.objective}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass p-8 cyber-border border-primary/10"
                >
                  <h3 className="text-primary font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Resultados_Esperados
                  </h3>
                  <p className="text-secondary font-body text-sm leading-relaxed opacity-80">
                    {course.results}
                  </p>
                </motion.div>
              </div>

              {/* Syllabus Section (Accordion Style) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Contenido del Curso</h2>
                  </div>
                  <div className="text-[10px] font-mono text-secondary/50 uppercase tracking-widest">
                    {course.syllabus.length} Módulos
                  </div>
                </div>
                
                <div className="space-y-2">
                  {course.syllabus.map((module, i) => (
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
                              {module.lessons.map((lesson, j) => (
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
              </motion.div>

              {/* Course Gallery for Finished Courses */}
              {course.status === 'finished' && course.gallery && course.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Galería del Curso</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.gallery.map((img, i) => (
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
                </motion.div>
              )}

              {/* Relevant Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass p-8 cyber-border bg-primary/5 border-primary/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Info className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-display font-bold uppercase tracking-tight text-primary">Información Relevante</h2>
                </div>
                <p className="text-secondary font-body leading-relaxed opacity-90">
                  {course.relevantInfo}
                </p>
              </motion.div>
            </div>

            {/* Right Column: Enrollment & Instructor */}
            <div className="lg:col-span-1 space-y-8">
              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass p-8 cyber-border sticky top-32 ${course.status === 'finished' ? 'border-secondary/20' : ''}`}
              >
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
              </motion.div>

              <EnrollmentModal 
                isOpen={isEnrollModalOpen} 
                onClose={() => setIsEnrollModalOpen(false)} 
                courseName={course.name} 
              />

              {/* Instructor Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 cyber-border"
              >
                <h4 className="text-xs font-mono text-primary uppercase mb-6 tracking-widest">Instructor_Asignado</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 relative cyber-border overflow-hidden">
                    <Image 
                      src={instructor?.photo || 'https://picsum.photos/seed/user/200/200'}
                      alt={course.instructorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-display font-bold uppercase tracking-tight">{course.instructorName}</div>
                    <div className="text-[10px] font-mono text-primary/60 uppercase">{instructor?.specialty}</div>
                  </div>
                </div>
                <p className="text-[11px] text-secondary font-body leading-relaxed opacity-70 mb-6">
                  {instructor?.experience}
                </p>
                <Link 
                  href={`/profile/${course.instructorId}`}
                  className="text-[10px] font-mono text-primary hover:underline uppercase tracking-widest flex items-center gap-2"
                >
                  Ver Perfil Completo <ArrowLeft className="w-3 h-3 rotate-180" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
