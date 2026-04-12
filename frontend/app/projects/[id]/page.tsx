'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { projects, incubatorProjects } from '@/lib/data';
import Image from 'next/image';
import { Calendar, User, Heart, Tag, ArrowLeft, Share2, MessageSquare, ShieldCheck, Users, Zap, Target, ArrowUpRight, Cpu, Globe } from 'lucide-react';
import Link from 'next/link';
import Markdown from 'react-markdown';

export default function ProjectDetailsPage() {
  const params = useParams();
  const [isJoining, setIsJoining] = React.useState(false);

  // Search in both projects and incubatorProjects
  const researchProject = projects.find(p => p.id === params.id);
  const incubatorProject = incubatorProjects.find(p => p.id === params.id);
  
  const project = researchProject || incubatorProject;

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold mb-4 uppercase tracking-tighter">Proyecto no encontrado</h1>
            <Link href="/projects" className="hud-button">Volver a Proyectos</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Normalize data for display
  const isIncubator = !!incubatorProject;
  const author = project.author || 'SICI_TEAM';
  const date = (project as any).date || '2024-01-01';
  const likes = (project as any).likes || 0;
  const tags = (project as any).tags || (project as any).categories || [];
  const content = project.content || project.description;

  const handleJoin = () => {
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      alert('Solicitud de colaboración enviada al investigador principal.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href={isIncubator ? "/incubator" : "/projects"} className="inline-flex items-center gap-2 text-[10px] font-mono text-primary hover:underline mb-12 uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> VOLVER_A_{isIncubator ? 'INCUBADORA' : 'PROYECTOS'}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="hud-tag bg-primary/10 border-primary/20 text-primary">{tag}</span>
                ))}
                {isIncubator && (
                  <span className="hud-tag bg-amber-500/10 border-amber-500/20 text-amber-400">INCUBADORA</span>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-8 py-6 border-y border-white/5">
                <Link href={`/profile/${(project as any).authorId || 'u1'}`} className="flex items-center gap-3 hover:bg-primary/5 transition-colors cursor-pointer p-2 rounded-sm">
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Investigador_Líder</div>
                    <div className="text-sm font-mono text-on-surface uppercase">{author}</div>
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center border border-white/10">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Fecha_Inicio</div>
                    <div className="text-sm font-mono text-on-surface uppercase">{date}</div>
                  </div>
                </div>
                {!isIncubator && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center border border-white/10">
                      <Heart className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Interacciones</div>
                      <div className="text-sm font-mono text-on-surface uppercase">{likes} LIKES</div>
                    </div>
                  </div>
                )}
                {isIncubator && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center border border-white/10">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Estado_Actual</div>
                      <div className="text-sm font-mono text-on-surface uppercase">{incubatorProject.status}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 aspect-video relative cyber-border overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              
              <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="glass p-6 cyber-border flex-grow flex flex-col justify-center items-center text-center space-y-4">
                  <div className="text-[8px] font-mono text-primary/40 uppercase tracking-widest">Progreso_Estimado</div>
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                      <motion.circle 
                        cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="2" 
                        strokeDasharray="283" 
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * 0.65) }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl text-primary">65%</div>
                  </div>
                  <div className="text-[10px] font-mono text-secondary uppercase tracking-widest">Fase: {isIncubator ? incubatorProject.status : 'Desarrollo'}</div>
                </div>
                <div className="glass p-6 cyber-border flex flex-col justify-center items-center text-center">
                  <div className="text-[8px] font-mono text-primary/40 uppercase tracking-widest mb-2">Impacto_SICI</div>
                  <div className="text-2xl font-display font-bold text-primary">HIGH</div>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-1 h-3 ${i <= 4 ? 'bg-primary' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div className="glass p-8 md:p-12 cyber-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">PROJECT_CONTENT_LOG</div>
                  <div className="prose prose-invert max-w-none font-body text-secondary leading-relaxed">
                    <Markdown>{content}</Markdown>
                  </div>
                </div>
                
                {isIncubator && (
                  <div className="glass p-8 md:p-12 cyber-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">TEAM_ROSTER</div>
                    <h3 className="text-lg font-display font-bold uppercase tracking-tight text-on-surface mb-8">Equipo de Desarrollo</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {incubatorProject.team.map(member => (
                        <Link key={member.userId} href={`/profile/${member.userId}`} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-on-surface uppercase tracking-tight">{member.name}</div>
                            <div className="text-[10px] text-primary uppercase tracking-widest">{member.role}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass p-8 md:p-12 cyber-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">SECURITY_VALIDATION</div>
                  <div className="flex items-center gap-6">
                    <ShieldCheck className="w-12 h-12 text-primary glow-red shrink-0" />
                    <div>
                      <h3 className="text-lg font-display font-bold uppercase tracking-tight text-on-surface mb-2">Investigación Validada</h3>
                      <p className="text-sm text-secondary opacity-70">Este proyecto ha sido revisado por el comité científico de la SICI y cumple con todos los estándares de ética e innovación de la UNIVALLE.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-8">
                <div className="glass p-8 cyber-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">ACTIONS_MENU</div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Interactuar</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={handleJoin}
                      disabled={isJoining}
                      className="hud-button w-full flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isJoining ? (
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                      {isJoining ? 'PROCESANDO...' : 'SOLICITAR_UNIRSE'}
                    </button>
                    {!isIncubator && (
                      <button className="w-full px-6 py-3 glass hover:bg-white/5 text-white rounded-sm font-bold transition-all flex items-center justify-center uppercase tracking-[0.2em] text-[10px] border border-white/10 font-mono gap-3">
                        <Heart className="w-4 h-4" /> Dar Like
                      </button>
                    )}
                    <button className="w-full px-6 py-3 glass hover:bg-white/5 text-white rounded-sm font-bold transition-all flex items-center justify-center uppercase tracking-[0.2em] text-[10px] border border-white/10 font-mono gap-3">
                      <Share2 className="w-4 h-4" /> Compartir
                    </button>
                  </div>
                </div>

                {isIncubator && (
                  <div className="glass p-8 cyber-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">TECH_STACK</div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Tecnologías</h3>
                    <div className="flex flex-wrap gap-2">
                      {incubatorProject.technologies.map(tech => (
                        <span key={tech} className="text-[9px] font-mono text-outline border border-white/10 px-2 py-1 bg-white/5 uppercase tracking-widest">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass p-8 cyber-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">RELATED_TAGS</div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Etiquetas_Relacionadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <span key={tag} className="text-[8px] font-mono text-outline border border-white/10 px-2 py-1 bg-white/5 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
