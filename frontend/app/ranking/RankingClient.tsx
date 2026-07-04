'use client';

import React, { useState } from 'react';
import RankingPodiumCard from '@/components/RankingPodiumCard';
import RankingListItem from '@/components/RankingListItem';
import { Search } from 'lucide-react';

interface RankingUser {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  isiPoints: number;
}

export default function RankingClient({ ranking }: { ranking: RankingUser[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRanking = ranking.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="text-center mb-16">
        <div>
          <div className="hud-tag mb-4 inline-block">SICI_NETWORK // RANKING_SYSTEM_V2.0</div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase text-on-surface">
            Cuadro de <span className="text-primary glow-red">Honor</span>
          </h1>
          <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
            Reconociendo el aporte de nuestra comunidad, medido en isipoints.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-16">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/50" />
          <input
            type="text"
            placeholder="BUSCAR MIEMBRO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container border border-outline/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-on-surface uppercase"
          />
        </div>
      </div>

      {/* Top 3 Podium */}
      {filteredRanking.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-end">
          <div className="order-2 md:order-1">
            <RankingPodiumCard user={filteredRanking[1]} position={2} delay={0.1} />
          </div>
          <div className="order-1 md:order-2">
            <RankingPodiumCard user={filteredRanking[0]} position={1} delay={0} />
          </div>
          <div className="order-3">
            <RankingPodiumCard user={filteredRanking[2]} position={3} delay={0.2} />
          </div>
        </div>
      )}

      {/* Rest of Ranking */}
      <div className="space-y-4">
        {filteredRanking.slice(3).map((user, idx) => (
          <RankingListItem key={user.id} user={user} index={idx} />
        ))}
      </div>

      {filteredRanking.length === 0 && (
        <div className="text-center py-20">
          <p className="text-secondary font-mono text-sm uppercase tracking-widest">
            No hay usuarios en el ranking
          </p>
        </div>
      )}
    </>
  );
}
