'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit3, Github, Linkedin, Twitter, Globe, Trophy, Award } from 'lucide-react';
import EditProfileModal from '@/components/EditProfileModal';
import SkillsEditor from '@/components/SkillsEditor';
import { getLevelForPoints } from '@/lib/constants/levels';

interface User {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  bio: string | null;
  socials: Record<string, string>;
  isiPoints: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string | null;
}

interface Badge {
  id: string;
  badgeName: string | null;
  count: number;
}

interface Contributions {
  projects: { id: string; title: string; status: string }[];
  articles: { id: string; title: string; status: string }[];
  incubatorProjects: { id: string; title: string; status: string }[];
  mentorships: { id: string; title: string; status: string }[];
  forumQuestions: { id: string; title: string; status: string }[];
}

interface Skill {
  id: string;
  skillName: string;
}

const SOCIAL_ICONS: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe };

export default function ProfileClient({
  user,
  achievements,
  badges,
  contributions,
  skills,
  isOwnProfile,
}: {
  user: User;
  achievements: Achievement[];
  badges: Badge[];
  contributions: Contributions;
  skills: Skill[];
  isOwnProfile: boolean;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const level = getLevelForPoints(user.isiPoints);
  const activeSocials = Object.entries(user.socials || {}).filter(([, v]) => v);

  const contributionSections = [
    { label: 'Proyectos', items: contributions.projects, href: '/projects' },
    { label: 'Artículos', items: contributions.articles, href: '/articles' },
    { label: 'Incubadora', items: contributions.incubatorProjects, href: '/incubator' },
    { label: 'Mentorías', items: contributions.mentorships, href: '/mentorship' },
    { label: 'Foro', items: contributions.forumQuestions, href: '/forum' },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-28 h-28 relative rounded-full overflow-hidden shrink-0">
          <Image src={user.avatar || '/placeholder-avatar.png'} alt={user.name} fill className="object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="flex-grow text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
              <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">{level.name}</span>
                <span className="text-sm text-text-muted">· {user.isiPoints} isipoints</span>
              </div>
            </div>
            {isOwnProfile && (
              <button onClick={() => setIsEditOpen(true)} className="btn-secondary flex items-center gap-2 text-sm">
                <Edit3 className="w-4 h-4" /> Editar perfil
              </button>
            )}
          </div>

          {user.bio && <p className="text-text-secondary mt-4">{user.bio}</p>}

          {activeSocials.length > 0 && (
            <div className="flex gap-3 justify-center sm:justify-start mt-4">
              {activeSocials.map(([key, value]) => {
                const Icon = SOCIAL_ICONS[key] || Globe;
                return (
                  <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center hover:bg-surface-hover transition-colors">
                    <Icon className="w-4 h-4 text-text-secondary" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Skills</h3>
        <SkillsEditor skills={skills} editable={isOwnProfile} />
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Insignias
          </h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b.id} className="badge badge-primary">
                {b.badgeName} {b.count > 1 && `x${b.count}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Logros</h3>
          <div className="space-y-2">
            {achievements.map((a) => (
              <div key={a.id} className="text-sm text-text-secondary">
                <span className="text-text-primary font-medium">{a.title}</span>
                {a.description && <span> — {a.description}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contributions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Aportes en la plataforma</h3>
        {contributionSections.length === 0 && <p className="text-sm text-text-muted">Aún sin aportes registrados.</p>}
        <div className="space-y-6">
          {contributionSections.map((section) => (
            <div key={section.label}>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{section.label}</h4>
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{item.title}</span>
                    <span className="badge text-xs">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOwnProfile && (
        <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={user} />
      )}
    </div>
  );
}
