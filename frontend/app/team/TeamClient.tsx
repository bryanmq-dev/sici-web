'use client';

import { motion } from 'motion/react';
import TeamMemberCard from '@/components/TeamMemberCard';
import { genderizeTitle } from '@/lib/utils';

interface SocietyUnit {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

interface SocietyMembership {
  id: string;
  role: string;
  since: string | null;
  isActive: boolean;
  userId: string | null;
  unitId: string | null;
  userName: string | null;
  userAvatar: string | null;
  userEmail: string | null;
  userGender: string | null;
  unitName: string | null;
}

export default function TeamClient({ units, memberships }: { units: SocietyUnit[]; memberships: SocietyMembership[] }) {
  const groupedMemberships = units.map(unit => ({
    unit,
    members: memberships.filter(m => m.unitId === unit.id),
  }));

  return (
    <>
      <div className="text-center mb-24">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase"
          >
            Nuestro <span className="text-primary glow-red">Equipo</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70"
          >
            Liderazgo multidisciplinario forjando el futuro de la ingeniería y la investigación en UNIVALLE.
          </motion.p>
        </div>
      </div>

      <div className="space-y-32">
        {groupedMemberships.map(({ unit, members }) => (
          <section key={unit.id}>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-px bg-primary" />
              <h2 className="text-2xl font-display font-bold uppercase tracking-tighter text-primary">
                {unit.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {members.map((member, memberIdx) => (
                <TeamMemberCard 
                  key={member.id} 
                  member={{
                    id: member.userId || member.id,
                    name: member.userName || 'Sin nombre',
                    role: genderizeTitle(member.role, member.userGender),
                    avatar: member.userAvatar || '/placeholder-avatar.jpg',
                    type: 'directivo' as const,
                  }}
                  index={memberIdx} 
                />
              ))}
            </div>

            {members.length === 0 && (
              <p className="text-secondary/60 font-mono text-sm uppercase tracking-widest">
                Sin miembros registrados
              </p>
            )}
          </section>
        ))}
      </div>

      {units.length === 0 && (
        <div className="text-center py-20">
          <p className="text-secondary font-mono text-sm uppercase tracking-widest">
            No hay unidades registradas
          </p>
        </div>
      )}
    </>
  );
}
