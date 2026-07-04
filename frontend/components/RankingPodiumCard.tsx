'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { getLevelForPoints } from '@/lib/constants/levels';

interface RankingUser {
  id: string;
  name: string;
  avatar: string | null;
  isiPoints: number;
}

export default function RankingPodiumCard({ user, position, delay }: { user: RankingUser; position: number; delay: number }) {
  if (!user) return null;

  const level = getLevelForPoints(user.isiPoints);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`glass p-8 cyber-border group relative overflow-hidden text-center ${position === 1 ? 'lg:scale-110 lg:z-10 bg-primary/5 border-primary/30 pb-16' : 'pb-12'}`}
    >
      <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">RANK_ID: {position}</div>

      <div className={`mx-auto relative overflow-hidden cyber-border mb-8 ${position === 1 ? 'w-40 h-40' : 'w-32 h-32'}`}>
        <Image
          src={user.avatar || '/placeholder-avatar.png'}
          alt={user.name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Trophy className={`w-6 h-6 ${position === 1 ? 'text-yellow-500' : position === 2 ? 'text-gray-400' : 'text-amber-600'} glow-red`} />
          <span className="hud-badge hud-badge-primary !text-2xl !px-4 !py-2">#{position}</span>
        </div>

        <div>
          <h3 className="text-2xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors text-on-surface">
            {user.name}
          </h3>
          <p className="text-[10px] text-primary font-mono uppercase tracking-widest opacity-80">{level.name}</p>
        </div>

        <div className="text-center pt-4">
          <div className="text-5xl font-display font-bold text-primary mb-1 tracking-tighter">{user.isiPoints}</div>
          <div className="text-[8px] text-outline font-mono uppercase tracking-widest">isipoints</div>
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
