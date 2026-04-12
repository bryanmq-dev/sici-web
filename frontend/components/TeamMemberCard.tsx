'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { TeamMemberInfo } from '@/lib/data';

interface TeamMemberCardProps {
  member: TeamMemberInfo;
  index: number;
}

export default function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/profile/${member.id}`} className="block">
        <div className="aspect-square relative overflow-hidden cyber-border mb-4">
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-full p-2 bg-black/60 backdrop-blur-sm border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="hud-tag text-center border-none bg-transparent">TYPE: {member.type.toUpperCase()}</div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-[10px] text-outline font-mono uppercase tracking-widest">
            {member.role}
          </p>
        </div>
      </Link>
      
      <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-primary/40 opacity-0 group-hover:opacity-100 transition-all" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-primary/40 opacity-0 group-hover:opacity-100 transition-all" />
    </motion.div>
  );
}
