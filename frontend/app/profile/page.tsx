'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { users, getDevRank, getResearchRank, articles, incubatorProjects } from '@/lib/data';
import Image from 'next/image';
import { 
  Shield, Cpu, Globe, Zap, User, Star, Github, Linkedin, Twitter, 
  ExternalLink, Award, Book, Code, ArrowUpRight, 
  Code2, Microscope, Trophy, Lock, Medal, Calendar, FileText,
  ChevronRight, Building, Rocket, GraduationCap, Search, Activity,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, any> = {
  Trophy, Zap, Shield, Lock, Star, Medal, Book, Building, Rocket, GraduationCap, Search, Code, Link: LinkIcon
};

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('sici_auth');
    if (auth !== 'true') {
      router.push('/login');
    }
  }, [router]);

  const user = users[0]; // Demo user

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          AUTENTICANDO_SESIÓN...
        </div>
      </div>
    );
  }

  const devRank = getDevRank(user.devScore);
  const researchRank = getResearchRank(user.researchScore);
  const userArticles = articles.filter(a => user.articleIds.includes(a.id));
  const userIncubatorProjects = incubatorProjects.filter(p => user.incubatorProjectIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column: Profile Card & Skills */}
            <div className="lg:col-span-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-6 sm:p-8 cyber-border relative overflow-hidden text-center"
              >
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">USER_ID: {user.id}</div>
                
                <div className="w-32 h-32 sm:w-48 sm:h-48 mx-auto relative overflow-hidden cyber-border mb-8">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-display font-bold uppercase tracking-tighter text-on-surface leading-tight">
                      {user.name}
                    </h1>
                    <p className="text-[12px] text-primary font-mono uppercase tracking-widest mt-2">
                      {user.role}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                    <div className="space-y-1">
                      <div className="text-xl font-display font-bold text-primary tracking-tighter">{user.devScore}</div>
                      <div className="text-[7px] text-outline font-mono uppercase tracking-widest">DevCore</div>
                    </div>
                    <div className="space-y-1 border-l border-white/5">
                      <div className="text-xl font-display font-bold text-primary tracking-tighter">{user.researchScore}</div>
                      <div className="text-[7px] text-outline font-mono uppercase tracking-widest">Insight</div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-2">
                      <div className={`p-2 bg-white/5 border border-white/10 cyber-border flex items-center justify-between px-4 group hover:border-primary/50 transition-all`}>
                        <div className="flex items-center gap-2">
                          <Code2 className={`w-4 h-4 ${devRank.color}`} />
                          <div className="text-[8px] font-mono text-secondary/60 uppercase tracking-widest">Dev_Rank</div>
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${devRank.color}`}>{devRank.name}</div>
                      </div>
                      <div className={`p-2 bg-white/5 border border-white/10 cyber-border flex items-center justify-between px-4 group hover:border-primary/50 transition-all`}>
                        <div className="flex items-center gap-2">
                          <Microscope className={`w-4 h-4 ${researchRank.color}`} />
                          <div className="text-[8px] font-mono text-secondary/60 uppercase tracking-widest">Res_Rank</div>
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${researchRank.color}`}>{researchRank.name}</div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      {user.socials.github && (
                        <a href={user.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-secondary hover:text-primary">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {user.socials.linkedin && (
                        <a href={user.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-secondary hover:text-primary">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {user.socials.twitter && (
                        <a href={user.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-secondary hover:text-primary">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {user.socials.website && (
                        <a href={user.socials.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-secondary hover:text-primary">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Memberships Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="glass p-8 cyber-border relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">UNIT_AFFILIATIONS</div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Unidades_y_Cargos</h3>
                <div className="space-y-4">
                  {user.memberships.map((membership: { unit: string; role: string; since: string }, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 hover:border-primary/30 transition-all">
                      <div className="p-2 bg-primary/10 cyber-border">
                        {membership.unit.includes('Científica') ? <Search className="w-4 h-4 text-primary" /> : 
                         membership.unit.includes('Incubadora') ? <Rocket className="w-4 h-4 text-primary" /> :
                         membership.unit.includes('Mentor') ? <GraduationCap className="w-4 h-4 text-primary" /> :
                         <Building className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-tight text-white">{membership.unit}</div>
                        <div className="text-[9px] font-mono text-primary uppercase tracking-widest">{membership.role}</div>
                        <div className="text-[8px] font-mono text-secondary/40 uppercase">Desde: {membership.since}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-8 cyber-border relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">SKILLS_MATRIX</div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Habilidades_Técnicas</h3>
                <div className="space-y-6">
                  {user.skills.map((skill: { name: string; level: number }) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                        <span className="text-on-surface">{skill.name}</span>
                        <span className="text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-1 bg-white/5 border border-white/5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-primary glow-red"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Achievements & Badges Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="glass p-8 cyber-border relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">ACHIEVEMENTS_VAULT</div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Logros_y_Rangos</h3>
                
                <div className="space-y-8">
                  {/* Badges Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {user.badges.map((badge: { id: string; name: string; icon: string; rarity: string; unlockedAt?: string }) => {
                      const Icon = iconMap[badge.icon] || Award;
                      return (
                        <div 
                          key={badge.id} 
                          className="group relative flex flex-col items-center"
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                            badge.rarity === 'LEGENDARY' ? 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                            badge.rarity === 'EPIC' ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' :
                            badge.rarity === 'RARE' ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                            'bg-white/5 border-white/10'
                          } group-hover:scale-110`}>
                            <Icon className={`w-6 h-6 ${
                              badge.rarity === 'LEGENDARY' ? 'text-amber-400' :
                              badge.rarity === 'EPIC' ? 'text-purple-400' :
                              badge.rarity === 'RARE' ? 'text-blue-400' :
                              'text-secondary'
                            }`} />
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 p-2 bg-black/90 border border-white/10 text-[8px] font-mono text-center opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                            <div className="text-white font-bold">{badge.name}</div>
                            <div className="text-primary/60">{badge.rarity}</div>
                            {badge.unlockedAt && <div className="text-secondary/40">{badge.unlockedAt}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Achievements List */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    {user.achievements.map((achievement: { id: string; title: string; description: string; date: string; icon: string }) => {
                      const Icon = iconMap[achievement.icon] || Trophy;
                      return (
                        <div key={achievement.id} className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 hover:border-primary/30 transition-all">
                          <div className="p-2 bg-primary/10 cyber-border">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-tight text-white">{achievement.title}</div>
                            <p className="text-[9px] text-secondary/60 font-body leading-tight">{achievement.description}</p>
                            <div className="text-[8px] font-mono text-primary/40 uppercase">{achievement.date}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Bio, Projects & Articles */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-8 md:p-12 cyber-border relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">BIOGRAPHY_LOG</div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Sobre_el_Investigador</h3>
                <p className="text-secondary text-lg font-body leading-relaxed opacity-80">
                  {user.bio}
                </p>
              </motion.div>

              {/* Contributions Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-display font-bold uppercase tracking-tighter text-on-surface">Aportes_al_Sistema</h2>
                </div>

                {/* Research Projects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass p-8 md:p-12 cyber-border relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">RESEARCH_PROJECTS</div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8">Proyectos_de_Investigación</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {user.projects.map((project: { id: string; name: string; role: string; description: string }) => (
                      <div key={project.id} className="p-6 bg-surface-container-high border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2">
                          <div className="w-1 h-1 bg-primary/40" />
                        </div>
                        <h4 className="text-lg font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors mb-2">{project.name}</h4>
                        <div className="text-[9px] text-primary font-mono uppercase tracking-widest mb-4">ROLE: {project.role}</div>
                        <p className="text-[11px] text-secondary font-body leading-relaxed opacity-70 mb-6">{project.description}</p>
                        <Link href={`/projects/${project.id}`} className="text-[10px] font-mono text-primary hover:underline flex items-center gap-2">
                          ACCEDER_AL_PROYECTO <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                    {user.projects.length === 0 && (
                      <div className="col-span-2 text-center py-12 border border-dashed border-white/10 text-secondary/40 font-mono text-[10px] uppercase tracking-widest">
                        Sin proyectos de investigación registrados
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Incubator Projects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="glass p-8 md:p-12 cyber-border relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">INCUBATOR_PROJECTS</div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8">Proyectos_en_Incubadora</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userIncubatorProjects.map(project => (
                      <div key={project.id} className="p-6 bg-surface-container-high border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2">
                          <div className="w-1 h-1 bg-amber-500/40" />
                        </div>
                        <h4 className="text-lg font-display font-bold uppercase tracking-tight group-hover:text-amber-400 transition-colors mb-2">{project.title}</h4>
                        <div className="text-[9px] text-amber-400 font-mono uppercase tracking-widest mb-4">STATUS: {project.status}</div>
                        <p className="text-[11px] text-secondary font-body leading-relaxed opacity-70 mb-6 line-clamp-2">{project.description}</p>
                        <Link href={`/projects/${project.id}`} className="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-2">
                          VER_DESARROLLO <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                    {userIncubatorProjects.length === 0 && (
                      <div className="col-span-2 text-center py-12 border border-dashed border-white/10 text-secondary/40 font-mono text-[10px] uppercase tracking-widest">
                        Sin proyectos en incubadora registrados
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Articles Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass p-8 md:p-12 cyber-border relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">PUBLISHED_ARTICLES</div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8">Artículos_Publicados</h3>
                  <div className="space-y-6">
                    {userArticles.map(article => (
                      <div key={article.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-surface-container-high border border-white/5 hover:border-primary/30 transition-all group">
                        <div className="w-full sm:w-32 h-48 sm:h-32 relative overflow-hidden shrink-0">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-grow space-y-3">
                          <div className="flex items-center gap-2 text-[8px] font-mono text-primary uppercase tracking-widest">
                            <FileText className="w-3 h-3" /> {article.researchArea}
                          </div>
                          <h4 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                            {article.title}
                          </h4>
                          <p className="text-[11px] text-secondary font-body leading-relaxed opacity-70 line-clamp-2">
                            {article.abstract}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="text-[9px] font-mono text-secondary/40 uppercase">
                              {article.date}
                            </div>
                            <Link href={`/articles/${article.id}`} className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1">
                              LEER_ARTÍCULO <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                    {userArticles.length === 0 && (
                      <div className="text-center py-12 border border-dashed border-white/10 text-secondary/40 font-mono text-[10px] uppercase tracking-widest">
                        Sin artículos publicados registrados
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
