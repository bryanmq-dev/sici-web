'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Mentor } from '@/lib/data';

interface MentorCardProps {
  mentor: Mentor;
  index: number;
}

export default function MentorCard({ mentor, index }: MentorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass p-6 cyber-border group relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">MENTOR_ID: {mentor.id}</div>
      
      <div className="aspect-square relative overflow-hidden cyber-border mb-6">
        <Image
          src={mentor.photo}
          alt={mentor.name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-full p-2 bg-black/60 backdrop-blur-sm border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-[8px] font-mono text-primary text-center">TYPE: {mentor.type.toUpperCase()}</div>
        </div>
      </div>
      
      <div className="space-y-4 flex-grow flex flex-col">
        <div>
          <h3 className="text-lg font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
            {mentor.name}
          </h3>
          <p className="text-[10px] text-outline font-mono uppercase tracking-widest">
            {mentor.specialty}
          </p>
        </div>
        
        <p className="text-[11px] text-secondary font-body leading-relaxed opacity-70 line-clamp-3">
          {mentor.experience}
        </p>

        <div className="space-y-2">
          <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">Habilidades_Clave</div>
          <div className="flex flex-wrap gap-2">
            {mentor.skills.map(skill => (
              <span key={skill.name} className="hud-tag">{skill.name}</span>
            ))}
          </div>
        </div>

        <div className="pt-6 mt-auto flex items-center gap-4">
          <Link href={`/profile/${mentor.id}`} className="hud-button flex-grow flex items-center justify-center gap-2">
            Conectar
            <MessageSquare className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
