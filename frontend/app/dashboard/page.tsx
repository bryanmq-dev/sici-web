'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { users, getDevRank, getResearchRank, Quest, Badge } from '@/lib/data';
import RadarChart from '@/components/RadarChart';
import { 
  Shield, Cpu, Globe, Zap, User, Star, Trophy, Lock, Medal, 
  Calendar, FileText, ChevronRight, Award, Code2, Microscope,
  LayoutDashboard, Target, Box, Settings, ArrowUpRight, CheckCircle2,
  Clock, AlertCircle, Sparkles, Flame
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const iconMap: Record<string, any> = {
  Trophy, Zap, Shield, Lock, Star, Medal, Award, Code2, Microscope, Sparkles, Flame
};

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { challenges, notifications, Challenge, Notification } from '@/lib/data';

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'badges' | 'challenges'>('overview');

  useEffect(() => {
    const auth = localStorage.getItem('sici_auth');
    if (auth !== 'true') {
      router.push('/login');
    }
  }, [router]);

  // Simulating logged in user (u1 - Alejandro Chipana)
  const user = users[0];

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

  const radarData = user.skills.map((s: { name: string; level: number }) => ({ name: s.name, value: s.level }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div className="space-y-2 w-full md:w-auto">
              <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-mono text-primary uppercase tracking-[0.3em]">
                <LayoutDashboard className="w-3 h-3" /> TERMINAL_DE_MANDO_V4.0
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-on-surface leading-none">
                Bienvenido, <Link href="/profile" className="text-primary hover:glow-red transition-all">{user.name.split(' ')[0]}</Link>
              </h1>
            </div>
            
            <div className="flex w-full md:w-auto gap-4">
              {/* Notification HUD */}
              <div className="glass flex-grow md:flex-grow-0 px-4 py-3 cyber-border flex items-center justify-center md:justify-start gap-4 relative group cursor-pointer">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full glow-red" />
                <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-64 glass cyber-border p-4 z-50">
                  <div className="text-[8px] font-mono text-primary uppercase tracking-widest mb-4">NOTIFICACIONES_HUD</div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="text-[9px] font-body border-b border-white/5 pb-2">
                        <div className="text-white font-bold">{n.title}</div>
                        <div className="text-secondary/60">{n.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={logout}
                className="glass px-6 py-3 cyber-border flex items-center gap-4 hover:bg-primary/10 transition-all group"
              >
                <div className="text-right">
                  <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest">Sesión_Activa</div>
                  <div className="text-[10px] font-mono text-primary uppercase tracking-widest group-hover:text-red-400 transition-colors">CERRAR_TERMINAL</div>
                </div>
                <Lock className="w-4 h-4 text-primary group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-4">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'VISTA_GENERAL', icon: LayoutDashboard },
                  { id: 'quests', label: 'MISIONES_ACTIVAS', icon: Target },
                  { id: 'challenges', label: 'DESAFÍOS_DIARIOS', icon: Flame },
                  { id: 'badges', label: 'COLECCIÓN_INSIGNIAS', icon: Award },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-4 px-6 py-4 font-mono text-[10px] uppercase tracking-widest transition-all cyber-border relative overflow-hidden group ${
                      activeTab === item.id 
                        ? 'bg-primary/10 text-primary border-primary/50' 
                        : 'bg-white/5 text-secondary/60 border-white/5 hover:bg-white/10 hover:text-on-surface'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {activeTab === item.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_12px_rgba(0,242,255,0.8)]"
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Stats Mini Card */}
              <div className="glass p-6 cyber-border space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest">Nivel_Desarrollo</div>
                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest">{devRank.name}</div>
                  </div>
                  <div className="h-1 bg-white/5 border border-white/5 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(user.devScore / 4000) * 100}%` }} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest">Nivel_Investigación</div>
                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest">{researchRank.name}</div>
                  </div>
                  <div className="h-1 bg-white/5 border border-white/5 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(user.researchScore / 4000) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="glass p-8 cyber-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Code2 className="w-12 h-12" />
                        </div>
                        <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest mb-2">DevCore_Points</div>
                        <div className="text-4xl font-display font-bold text-primary tracking-tighter">{user.devScore}</div>
                        <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-emerald-400 uppercase">
                          <ArrowUpRight className="w-3 h-3" /> +150 ESTA_SEMANA
                        </div>
                      </div>
                      <div className="glass p-8 cyber-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Microscope className="w-12 h-12" />
                        </div>
                        <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest mb-2">Insight_Points</div>
                        <div className="text-4xl font-display font-bold text-primary tracking-tighter">{user.researchScore}</div>
                        <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-emerald-400 uppercase">
                          <ArrowUpRight className="w-3 h-3" /> +85 ESTA_SEMANA
                        </div>
                      </div>
                      <div className="glass p-8 cyber-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Box className="w-12 h-12" />
                        </div>
                        <div className="text-[8px] font-mono text-secondary/50 uppercase tracking-widest mb-2">Proyectos_Activos</div>
                        <div className="text-4xl font-display font-bold text-primary tracking-tighter">{user.projects.length}</div>
                        <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-primary uppercase">
                          <ChevronRight className="w-3 h-3" /> VER_DETALLES
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Skills Radar */}
                      <div className="glass p-4 sm:p-8 cyber-border relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-0 left-0 p-4 text-[8px] font-mono text-primary/30 uppercase tracking-widest">SKILLS_RADAR_V1</div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 w-full">Matriz_de_Habilidades</h3>
                        <RadarChart data={radarData} size={320} />
                      </div>

                      {/* Skill Tree Visualization */}
                      <div className="glass p-8 cyber-border relative overflow-hidden">
                        <div className="absolute top-0 left-0 p-4 text-[8px] font-mono text-primary/30 uppercase tracking-widest">SKILL_TREE_V1</div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8">Árbol_de_Tecnologías</h3>
                        <div className="space-y-6">
                          {user.skills.map((skill: { name: string; level: number }, i: number) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                                <span className="text-secondary">{skill.name}</span>
                                <span className="text-primary">LVL_{skill.level}</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 cyber-border overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(skill.level / 100) * 100}%` }}
                                  className="h-full bg-primary shadow-[0_0_8px_rgba(0,242,255,0.6)]"
                                />
                              </div>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(node => (
                                  <div 
                                    key={node} 
                                    className={`w-2 h-2 border border-white/10 ${skill.level >= node * 20 ? 'bg-primary glow-red' : 'bg-transparent'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="absolute bottom-4 right-4 text-[6px] font-mono text-primary/20">SICI_SKILL_TREE_V1.2</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'quests' && (
                  <motion.div
                    key="quests"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Misiones_Disponibles</h3>
                      <div className="flex gap-4 text-[8px] font-mono text-secondary/50 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> 12 Completadas</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> 2 En Curso</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {user.activeQuests.map((quest: { id: string; title: string; status: string; progress: number; reward: { devPoints: number; researchPoints: number }; category: string; description: string; difficulty: string }) => (
                        <div key={quest.id} className="glass p-6 cyber-border relative overflow-hidden group hover:border-primary/50 transition-all">
                          <div className={`absolute top-0 right-0 px-3 py-1 text-[7px] font-mono uppercase tracking-widest ${
                            quest.status === 'active' ? 'bg-primary text-background' : 'bg-white/10 text-secondary'
                          }`}>
                            {quest.status}
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              {quest.category === 'dev' ? <Code2 className="w-4 h-4 text-primary" /> : <Microscope className="w-4 h-4 text-secondary" />}
                              <h4 className="text-lg font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{quest.title}</h4>
                            </div>
                            
                            <p className="text-[11px] text-secondary/70 font-body leading-relaxed line-clamp-2">
                              {quest.description}
                            </p>

                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                              <div className="space-y-1">
                                <div className="text-[7px] text-secondary/40 font-mono uppercase tracking-widest">Recompensa</div>
                                <div className="text-[10px] font-mono text-primary uppercase tracking-widest">
                                  {quest.reward.devPoints > 0 && `+${quest.reward.devPoints} DEV `}
                                  {quest.reward.researchPoints > 0 && `+${quest.reward.researchPoints} RES`}
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <div className="text-[7px] text-secondary/40 font-mono uppercase tracking-widest">Dificultad</div>
                                <div className={`text-[10px] font-mono uppercase tracking-widest ${
                                  quest.difficulty === 'HARD' ? 'text-red-400' : quest.difficulty === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                                }`}>
                                  {quest.difficulty}
                                </div>
                              </div>
                            </div>

                            <button className={`w-full py-3 text-[9px] font-mono uppercase tracking-widest transition-all ${
                              quest.status === 'active' 
                                ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30' 
                                : 'bg-white/5 text-secondary border border-white/10 hover:bg-white/10 hover:text-primary'
                            }`}>
                              {quest.status === 'active' ? 'CONTINUAR_MISIÓN' : 'ACEPTAR_MISIÓN'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'challenges' && (
                  <motion.div
                    key="challenges"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Desafíos_del_Sistema</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {challenges.map(challenge => (
                        <div key={challenge.id} className="glass p-6 cyber-border relative overflow-hidden group hover:border-primary/50 transition-all">
                          <div className={`absolute top-0 right-0 px-3 py-1 text-[7px] font-mono uppercase tracking-widest ${
                            challenge.type === 'daily' ? 'bg-primary text-background' : 'bg-secondary text-background'
                          }`}>
                            {challenge.type}
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Flame className={`w-4 h-4 ${challenge.isCompleted ? 'text-emerald-400' : 'text-primary'}`} />
                              <h4 className={`text-lg font-display font-bold uppercase tracking-tight ${challenge.isCompleted ? 'text-emerald-400' : 'group-hover:text-primary'} transition-colors`}>
                                {challenge.title}
                                {challenge.isCompleted && ' [COMPLETADO]'}
                              </h4>
                            </div>
                            
                            <p className="text-[11px] text-secondary/70 font-body leading-relaxed">
                              {challenge.description}
                            </p>

                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                              <div className="space-y-1">
                                <div className="text-[7px] text-secondary/40 font-mono uppercase tracking-widest">Recompensa</div>
                                <div className="text-[10px] font-mono text-primary uppercase tracking-widest">
                                  +{challenge.reward.devPoints} DEV / +{challenge.reward.researchPoints} RES
                                </div>
                              </div>
                              {!challenge.isCompleted && (
                                <button className="px-4 py-2 bg-primary/10 border border-primary/30 text-[8px] font-mono text-primary uppercase tracking-widest hover:bg-primary/20 transition-all">
                                  RECLAMAR
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'badges' && (
                  <motion.div
                    key="badges"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {user.badges.map((badge: { id: string; name: string; icon: string; rarity: string; unlockedAt?: string }) => {
                        const Icon = iconMap[badge.icon] || Award;
                        return (
                          <div key={badge.id} className="flex flex-col items-center text-center space-y-4 group">
                            <div className={`w-24 h-24 relative flex items-center justify-center cyber-border transition-all duration-500 group-hover:scale-110 ${
                              badge.rarity === 'LEGENDARY' ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' :
                              badge.rarity === 'EPIC' ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]' :
                              badge.rarity === 'RARE' ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(0,242,255,0.2)]' :
                              'bg-white/5 border-white/10'
                            }`}>
                              <Icon className={`w-10 h-10 ${
                                badge.rarity === 'LEGENDARY' ? 'text-amber-400' :
                                badge.rarity === 'EPIC' ? 'text-purple-400' :
                                badge.rarity === 'RARE' ? 'text-primary' :
                                'text-secondary'
                              }`} />
                              
                              {/* Rarity Label */}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-background border border-white/10 text-[6px] font-mono uppercase tracking-widest">
                                {badge.rarity}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">{badge.name}</div>
                              <div className="text-[7px] font-mono text-secondary/40 uppercase">Desbloqueado: {badge.unlockedAt}</div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Locked Badges Placeholder */}
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4 opacity-30 grayscale">
                          <div className="w-24 h-24 relative flex items-center justify-center cyber-border bg-white/5 border-white/5">
                            <Lock className="w-8 h-8 text-secondary" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-tight text-secondary">BLOQUEADO</div>
                            <div className="text-[7px] font-mono text-secondary/40 uppercase">???</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
