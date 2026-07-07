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
      className={`card p-6 text-center flex flex-col ${position === 1 ? 'lg:scale-110 lg:z-10 bg-primary/5 border-primary/30' : ''}`}
    >
      <div className={`mx-auto relative overflow-hidden rounded-full bg-surface-muted mb-6 ${position === 1 ? 'w-32 h-32' : 'w-24 h-24'}`}>
        <Image
          src={user.avatar || '/placeholder-avatar.png'}
          alt={user.name}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-4 flex-grow flex flex-col">
        <div className="flex items-center justify-center gap-2">
          <Trophy className={`w-5 h-5 ${position === 1 ? 'text-yellow-500' : position === 2 ? 'text-gray-400' : 'text-amber-600'}`} />
          <span className="badge-primary text-sm">#{position}</span>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
            {user.name}
          </h3>
          <p className="text-xs text-primary">{level.name}</p>
        </div>

        <div className="text-center py-2">
          <div className="text-4xl font-bold text-primary mb-1">{user.isiPoints}</div>
          <div className="text-xs text-text-muted uppercase tracking-wide">isiPoints</div>
        </div>

        <div className="pt-2 mt-auto">
          <Link href={`/profile/${user.id}`} className="btn-primary flex items-center justify-center gap-2 p-2 rounded-sm w-full">
            Ver Expediente
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
