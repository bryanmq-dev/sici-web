'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { getDevRank, getResearchRank } from '@/lib/data';

interface RankingPodiumCardProps {
  user: any;
  position: number;
  category: 'dev' | 'research';
  delay: number;
  isMain?: boolean;
}

export default function RankingPodiumCard({ user, position, category, delay, isMain = false }: RankingPodiumCardProps) {
  if (!user) return null;
  
  const points = category === 'dev' ? user.devScore : user.researchScore;
  const devRank = getDevRank(user.devScore);
  const researchRank = getResearchRank(user.researchScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`glass p-8 cyber-border group relative overflow-hidden text-center ${
        isMain ? 'lg:scale-110 lg:z-10 bg-primary/5 border-primary/30 pb-16' : 'pb-12'
      }`}
    >
      <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">RANK_ID: {position}</div>
      
      <div className={`mx-auto relative overflow-hidden cyber-border mb-8 ${isMain ? 'w-40 h-40' : 'w-32 h-32'}`}>
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Trophy className={`w-6 h-6 ${
            position === 1 ? 'text-yellow-500' : position === 2 ? 'text-gray-400' : 'text-amber-600'
          } glow-red`} />
          <span className="hud-badge hud-badge-primary !text-2xl !px-4 !py-2">#{position}</span>
        </div>
        
        <div>
          <h3 className="text-2xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors text-on-surface">
            {user.name}
          </h3>
          <p className="text-[10px] text-outline font-mono uppercase tracking-widest opacity-60">
            {user.rank}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-6 border-y border-outline/5">
          <div className="space-y-1">
            <div className={`text-[9px] font-mono uppercase tracking-widest ${devRank.color}`}>{devRank.name}</div>
            <div className="text-xs font-display font-bold text-on-surface">{user.devScore}</div>
            <div className="text-[7px] font-mono text-secondary/40 uppercase">DevCore</div>
          </div>
          <div className="space-y-1 border-l border-outline/5">
            <div className={`text-[9px] font-mono uppercase tracking-widest ${researchRank.color}`}>{researchRank.name}</div>
            <div className="text-xs font-display font-bold text-on-surface">{user.researchScore}</div>
            <div className="text-[7px] font-mono text-secondary/40 uppercase">Insight</div>
          </div>
        </div>
        
        <div className="text-center pt-4">
          <div className="text-5xl font-display font-bold text-primary mb-1 tracking-tighter">{points}</div>
          <div className="text-[8px] text-outline font-mono uppercase tracking-widest">
            Puntos de {category === 'dev' ? 'Desarrollo' : 'Investigación'}
          </div>
        </div>

        <div className="pt-8">
          <Link href={`/profile/${user.id}`} className="hud-button w-full flex items-center justify-center gap-2 py-4">
            VER EXPEDIENTE
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
