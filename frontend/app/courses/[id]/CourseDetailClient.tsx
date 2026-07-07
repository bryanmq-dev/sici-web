'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import EnrollmentModal from '@/components/EnrollmentModal';
import { Clock, GraduationCap, ArrowLeft, CheckCircle2, Info, BookOpen, Calendar, Zap, ChevronDown, PlayCircle } from 'lucide-react';
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

export default function CourseDetailClient({ course, isEnrolled, isAuthenticated }: { course: Course; isEnrolled: boolean; isAuthenticated: boolean }) {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);

  const syllabusArray = Array.isArray(course.syllabus) ? course.syllabus : [];
  const galleryArray = Array.isArray(course.gallery) ? course.gallery : [];

  return (
    <>
      <div className="mb-10">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Volver a Cursos
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Course Info */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            {course.category && <span className="badge-primary text-xs mb-4 inline-block">{course.category}</span>}
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              {course.name}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              {course.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide">Duración</div>
                  <div className="text-sm text-text-primary font-medium">{course.duration || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide">Certificación</div>
                  <div className="text-sm text-text-primary font-medium">Oficial SICI</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wide">Estado</div>
                  <div className="text-sm text-text-primary font-medium">{course.status === 'finished' ? 'Finalizado' : 'Activo'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Objective & Results Section */}
          {(course.objective || course.results) && (
            <div className="grid md:grid-cols-2 gap-6">
              {course.objective && (
                <div className="card p-6">
                  <h3 className="text-primary text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Objetivo del Curso
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {course.objective}
                  </p>
                </div>
              )}

              {course.results && (
                <div className="card p-6">
                  <h3 className="text-primary text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Resultados Esperados
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {course.results}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Syllabus Section */}
          {syllabusArray.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-text-primary">Contenido del Curso</h2>
                </div>
                <div className="text-xs text-text-muted uppercase tracking-wide">
                  {syllabusArray.length} Módulos
                </div>
              </div>

              <div className="space-y-2">
                {syllabusArray.map((module: any, i: number) => (
                  <div key={i} className="card overflow-hidden">
                    <button
                      onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                      className="w-full p-5 flex items-center justify-between group hover:bg-surface-muted transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-text-muted">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
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
                          <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                            {module.lessons && module.lessons.map((lesson: string, j: number) => (
                              <div key={j} className="flex items-center gap-3 text-sm text-text-secondary">
                                <PlayCircle className="w-4 h-4 text-primary/60" />
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
          )}

          {/* Course Gallery */}
          {course.status === 'finished' && galleryArray.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-text-primary">Galería del Curso</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryArray.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`Imagen de galería ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relevant Info */}
          {course.relevantInfo && (
            <div className="card p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-primary">Información Relevante</h2>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {course.relevantInfo}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Enrollment & Instructor */}
        <div className="lg:col-span-1 space-y-6">
          {/* Enrollment Card */}
          <div className="card p-6 sticky top-32">
            <div className="text-center mb-6">
              <div className="text-xs text-text-muted uppercase tracking-wide mb-2">
                {course.status === 'finished' ? 'Ciclo Finalizado' : 'Inscripción Abierta'}
              </div>
              <div className="text-3xl font-bold text-text-primary mb-2">
                {course.status === 'finished' ? 'Cerrado' : 'Gratuito'}
              </div>
              <div className="text-xs text-text-muted">
                {course.status === 'finished' ? 'Próximamente nueva edición' : 'Para miembros activos SICI'}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                'Acceso de por vida',
                'Certificado digital',
                'Material de estudio',
                'Sesiones de mentoría Q&A'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${course.status === 'finished' ? 'text-text-muted' : 'text-primary'}`} />
                  {feature}
                </div>
              ))}
            </div>

            {course.status !== 'active' ? (
              <button disabled className="btn-secondary flex items-center justify-center gap-2 p-2 rounded-sm w-full opacity-50 cursor-not-allowed">
                Inscripciones Cerradas
              </button>
            ) : enrolled ? (
              <button disabled className="btn-secondary flex items-center justify-center gap-2 p-2 rounded-sm w-full opacity-70 cursor-not-allowed">
                <CheckCircle2 className="w-4 h-4" /> Ya estás inscrito
              </button>
            ) : !isAuthenticated ? (
              <Link href="/login" className="btn-primary flex items-center justify-center gap-2 p-2 rounded-sm w-full">
                Inicia sesión para inscribirte
              </Link>
            ) : (
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="btn-primary flex items-center justify-center gap-2 p-2 rounded-sm w-full"
              >
                Inscribirme Ahora
              </button>
            )}
          </div>

          <EnrollmentModal
            isOpen={isEnrollModalOpen}
            onClose={() => setIsEnrollModalOpen(false)}
            courseId={course.id}
            courseName={course.name}
            onEnrolled={() => setEnrolled(true)}
          />

          {/* Instructor Card */}
          <div className="card p-6">
            <h4 className="text-xs text-text-muted uppercase tracking-wide mb-5">Instructor Asignado</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 relative rounded-full overflow-hidden shrink-0 bg-surface-muted">
                <Image
                  src={course.instructorAvatar || 'https://picsum.photos/seed/user/200/200'}
                  alt={course.instructorName || 'Instructor'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-base font-semibold text-text-primary">{course.instructorName || 'Por definir'}</div>
                <div className="text-xs text-text-muted">{course.mentorSpecialty || ''}</div>
              </div>
            </div>
            {course.mentorExperience && (
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {course.mentorExperience}
              </p>
            )}
            {course.mentorUserId && (
              <Link
                href={`/profile/${course.mentorUserId}`}
                className="text-sm text-primary hover:underline flex items-center gap-2"
              >
                Ver Perfil Completo <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
