'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { getDevRank, getResearchRank } from '@/lib/data';

interface RankingListItemProps {
  user: any;
  index: number;
  category: 'dev' | 'research';
}

export default function RankingListItem({ user, index, category }: RankingListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="p-4 md:p-6 hover:bg-primary/5 transition-colors group glass cyber-border mb-4"
    >
      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-12 items-center">
        <div className="col-span-1 text-center font-display font-bold text-lg text-secondary group-hover:text-primary transition-colors">
          #{index + 4}
        </div>
        <div className="col-span-4 px-4 flex items-center gap-4">
          <Link href={`/profile/${user.id}`} className="flex items-center gap-4 group/user">
            <div className="w-12 h-12 relative overflow-hidden border border-outline/10 shrink-0">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover grayscale group-hover/user:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-tight group-hover/user:text-primary transition-colors text-on-surface">
                {user.name}
              </div>
              <div className="text-[8px] font-mono text-secondary/40 uppercase">{user.rank}</div>
            </div>
          </Link>
        </div>
        <div className={`col-span-3 text-center text-[9px] font-mono uppercase tracking-widest ${getDevRank(user.devScore).color}`}>
          {getDevRank(user.devScore).name}
        </div>
        <div className={`col-span-3 text-center text-[9px] font-mono uppercase tracking-widest ${getResearchRank(user.researchScore).color}`}>
          {getResearchRank(user.researchScore).name}
        </div>
        <div className="col-span-1 text-right font-display font-bold text-primary tracking-tighter text-xl">
          {category === 'dev' ? user.devScore : user.researchScore}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="font-display font-bold text-lg text-primary w-8">
            #{index + 4}
          </div>
          <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
            <div className="w-10 h-10 relative overflow-hidden border border-outline/10 shrink-0">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-tight text-on-surface">
                {user.name}
              </div>
              <div className="text-[7px] font-mono text-secondary/40 uppercase">{user.rank}</div>
            </div>
          </Link>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-primary tracking-tighter text-lg">
            {category === 'dev' ? user.devScore : user.researchScore}
          </div>
          <div className="text-[6px] font-mono text-secondary/40 uppercase">Puntos</div>
        </div>
      </div>
    </motion.div>
  );
}
