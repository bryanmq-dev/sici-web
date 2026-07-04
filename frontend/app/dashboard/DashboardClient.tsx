'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Zap, Shield, Lock, Star, Medal, Award, Code2, Target,
  LayoutDashboard, LogOut, CalendarCheck
} from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getLevelForPoints, LEVELS } from '@/lib/constants/levels';

const iconMap: Record<string, any> = {
  Trophy, Zap, Shield, Lock, Star, Medal, Award, Code2
};

interface User {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  bio: string | null;
  isiPoints: number;
}

interface Achievement {
  id: string;
  title: string;
  icon: string | null;
  description: string | null;
  achievedAt: string | null;
}

interface UserBadge {
  id: string;
  badgeId: string | null;
  count: number;
  unlockedAt: Date;
  badgeName: string | null;
  badgeIcon: string | null;
  badgeRarity: string | null;
}

interface UserQuest {
  id: string;
  status: string;
  progress: number;
  questId: string | null;
  questTitle: string | null;
  questDescription: string | null;
  questPointsReward: number | null;
}

interface Quest {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  pointsReward: number;
  triggerType: string | null;
}

interface EventParticipation {
  id: string;
  eventId: string | null;
  eventTitle: string | null;
  intent: string;
  evaluationScore: number | null;
  appliesToScore: boolean | null;
  scoreDescription: string | null;
}

export default function DashboardClient({
  user,
  achievements,
  userBadges,
  userQuests,
  allQuests,
  eventParticipations,
}: {
  user: User;
  achievements: Achievement[];
  userBadges: UserBadge[];
  userQuests: UserQuest[];
  allQuests: Quest[];
  eventParticipations: EventParticipation[];
}) {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'badges' | 'eventos' | 'nivel'>('overview');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const logout = () => signOut({ callbackUrl: '/login' });

  const level = getLevelForPoints(user.isiPoints);
  const levelIndex = LEVELS.findIndex((l) => l.name === level.name);
  const nextLevel = LEVELS[levelIndex + 1];
  const autoQuests = allQuests.filter((q) => !!q.triggerType);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">
            Bienvenido, <Link href="/profile" className="text-primary hover:text-primary-hover transition-colors">{user.name.split(' ')[0]}</Link>
          </h1>
          <p className="text-text-secondary">Tu panel de control personal</p>
        </div>

        <button onClick={logout} className="btn-secondary gap-2">
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Vista General', icon: LayoutDashboard },
              { id: 'quests', label: 'Misiones', icon: Target },
              { id: 'badges', label: 'Insignias', icon: Award },
              { id: 'eventos', label: 'Eventos', icon: CalendarCheck },
              { id: 'nivel', label: 'Nivel', icon: Trophy },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary/5 text-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Stats Card */}
          <div className="card p-5 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-text-muted">Nivel</span>
                <span className="text-xs font-medium text-primary">{level.name}</span>
              </div>
              {nextLevel && (
                <>
                  <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((user.isiPoints - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-text-muted mt-1">{nextLevel.minPoints - user.isiPoints} pts para {nextLevel.name}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="card p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-text-muted">isipoints</div>
                        <div className="text-2xl font-bold text-text-primary">{user.isiPoints}</div>
                      </div>
                    </div>
                  </div>
                  <div className="card p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-text-muted">Logros</div>
                        <div className="text-2xl font-bold text-text-primary">{achievements.length}</div>
                      </div>
                    </div>
                  </div>
                  <div className="card p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-text-muted">Insignias</div>
                        <div className="text-2xl font-bold text-text-primary">{userBadges.length}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Logros Recientes</h3>
                  <div className="space-y-3">
                    {achievements.slice(0, 5).map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-surface-muted rounded-lg">
                        <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm font-medium text-text-primary">{achievement.title}</div>
                          <div className="text-xs text-text-muted">{achievement.description}</div>
                        </div>
                        <div className="text-xs text-text-muted">
                          {achievement.achievedAt ? new Date(achievement.achievedAt).toLocaleDateString() : ''}
                        </div>
                      </div>
                    ))}
                    {achievements.length === 0 && (
                      <p className="text-sm text-text-muted text-center py-4">Aún no tienes logros</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'quests' && (
              <motion.div key="quests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Misiones</h3>
                  <p className="text-xs text-text-muted mb-4">Siempre activas — tu progreso avanza automáticamente según lo que hagas en la plataforma.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {autoQuests.map(quest => {
                    const userQuest = userQuests.find(uq => uq.questId === quest.id);

                    return (
                      <div key={quest.id} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            <h4 className="text-sm font-semibold">{quest.title}</h4>
                          </div>
                          <span className={`badge ${
                            userQuest?.status === 'active' ? 'badge-primary' :
                            userQuest?.status === 'completed' ? 'badge-success' :
                            'badge-secondary'
                          }`}>
                            {userQuest?.status === 'completed' ? 'Completada' : userQuest?.status === 'active' ? 'En progreso' : 'Sin iniciar'}
                          </span>
                        </div>

                        <p className="text-xs text-text-secondary mb-4 line-clamp-2">{quest.description}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="text-xs text-text-muted">+{quest.pointsReward} pts</div>
                          <span className="badge badge-secondary text-[10px]">{quest.difficulty}</span>
                        </div>

                        <div className="mt-3">
                          <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${userQuest?.progress ?? 0}%` }} />
                          </div>
                          <div className="text-xs text-text-muted mt-1">{userQuest?.progress ?? 0}% completado</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {autoQuests.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-text-muted">No hay misiones disponibles</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-lg font-semibold mb-4">Tus Insignias</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userBadges.map(userBadge => {
                    const Icon = iconMap[userBadge.badgeIcon || 'Award'] || Award;
                    const rarity = userBadge.badgeRarity || 'COMMON';

                    return (
                      <div key={userBadge.id} className="card p-4 text-center relative">
                        {userBadge.count > 1 && (
                          <span className="absolute top-2 right-2 badge badge-primary text-[10px]">x{userBadge.count}</span>
                        )}
                        <div className={`w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-xl ${
                          rarity === 'LEGENDARY' ? 'bg-amber-500/10' :
                          rarity === 'EPIC' ? 'bg-purple-500/10' :
                          rarity === 'RARE' ? 'bg-primary/10' :
                          'bg-surface-muted'
                        }`}>
                          <Icon className={`w-8 h-8 ${
                            rarity === 'LEGENDARY' ? 'text-amber-500' :
                            rarity === 'EPIC' ? 'text-purple-500' :
                            rarity === 'RARE' ? 'text-primary' :
                            'text-text-secondary'
                          }`} />
                        </div>
                        <div className="text-sm font-medium text-text-primary mb-1">{userBadge.badgeName}</div>
                        <div className="text-xs text-text-muted">{new Date(userBadge.unlockedAt).toLocaleDateString()}</div>
                        <span className="badge badge-secondary text-[10px] mt-2">{rarity}</span>
                      </div>
                    );
                  })}

                  {userBadges.length === 0 && (
                    <p className="text-sm text-text-muted col-span-full text-center py-4">Aún no tienes insignias</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'eventos' && (
              <motion.div key="eventos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <h3 className="text-lg font-semibold mb-1">Eventos</h3>
                <p className="text-xs text-text-muted mb-4">Misiones especiales ligadas a eventos, evaluadas por el admin.</p>
                <div className="space-y-3">
                  {eventParticipations.map(ep => (
                    <div key={ep.id} className="card p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{ep.eventTitle}</div>
                        <div className="text-xs text-text-muted">{ep.intent === 'collaborate' ? 'Colaborar' : 'Apoyo'}{ep.scoreDescription ? ` — ${ep.scoreDescription}` : ''}</div>
                      </div>
                      {ep.evaluationScore != null ? (
                        <span className="badge badge-success">{ep.evaluationScore} pts</span>
                      ) : (
                        <span className="badge badge-secondary">Pendiente de evaluación</span>
                      )}
                    </div>
                  ))}
                  {eventParticipations.length === 0 && (
                    <p className="text-sm text-text-muted text-center py-8">No te has anotado a ningún evento todavía</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'nivel' && (
              <motion.div key="nivel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="text-lg font-semibold mb-4">Nivel de Desarrollo</h3>
                <div className="space-y-3">
                  {LEVELS.map((l, i) => (
                    <div key={l.name} className={`card p-4 flex items-center justify-between ${l.name === level.name ? 'border-primary' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${l.name === level.name ? 'bg-primary text-white' : 'bg-surface-muted text-text-muted'}`}>
                          {i + 1}
                        </div>
                        <div className="text-sm font-medium text-text-primary">{l.name}</div>
                      </div>
                      <div className="text-xs text-text-muted">{l.minPoints}+ pts</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
