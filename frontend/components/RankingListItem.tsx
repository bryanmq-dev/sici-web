'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { getLevelForPoints } from '@/lib/constants/levels';

interface RankingUser {
  id: string;
  name: string;
  avatar: string | null;
  isiPoints: number;
}

export default function RankingListItem({ user, index }: { user: RankingUser; index: number }) {
  const level = getLevelForPoints(user.isiPoints);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="card p-4 md:p-5 mb-3 hover:bg-surface-hover transition-colors group"
    >
      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-12 items-center">
        <div className="col-span-1 text-center font-semibold text-lg text-text-muted group-hover:text-primary transition-colors">
          #{index + 4}
        </div>
        <div className="col-span-7 px-4 flex items-center gap-4">
          <Link href={`/profile/${user.id}`} className="flex items-center gap-4 group/user">
            <div className="w-11 h-11 relative overflow-hidden rounded-full bg-surface-muted shrink-0">
              <Image
                src={user.avatar || '/placeholder-avatar.png'}
                alt={user.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary group-hover/user:text-primary transition-colors">
                {user.name}
              </div>
              <div className="text-xs text-primary">{level.name}</div>
            </div>
          </Link>
        </div>
        <div className="col-span-4 text-right font-bold text-primary text-xl">
          {user.isiPoints}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-lg text-primary w-8">
            #{index + 4}
          </div>
          <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
            <div className="w-10 h-10 relative overflow-hidden rounded-full bg-surface-muted shrink-0">
              <Image
                src={user.avatar || '/placeholder-avatar.png'}
                alt={user.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-text-primary">
                {user.name}
              </div>
              <div className="text-xs text-primary">{level.name}</div>
            </div>
          </Link>
        </div>
        <div className="text-right">
          <div className="font-bold text-primary text-lg">
            {user.isiPoints}
          </div>
          <div className="text-xs text-text-muted uppercase tracking-wide">isiPoints</div>
        </div>
      </div>
    </motion.div>
  );
}
