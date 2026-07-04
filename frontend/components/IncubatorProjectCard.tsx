'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, User, ArrowUpRight } from 'lucide-react';
import { IncubatorProject } from '@/lib/data';

interface IncubatorProjectCardProps {
  project: IncubatorProject;
  index: number;
}

export default function IncubatorProjectCard({ project, index }: IncubatorProjectCardProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="grid lg:grid-cols-2 gap-16 items-center"
    >
      <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
        <div className="aspect-video relative cyber-border overflow-hidden group">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 flex gap-2">
            {project.categories.map(cat => (
              <span key={cat} className="hud-badge hud-badge-primary">{cat}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center border border-primary/40 bg-primary/5">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold uppercase tracking-tighter text-on-surface">
              {project.title}
            </h2>
            <div className="text-[10px] text-primary font-mono uppercase tracking-widest">STATUS: {project.status}</div>
          </div>
        </div>

        <p className="text-secondary text-lg font-body leading-relaxed opacity-80">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Tecnologías</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech} className="hud-tag">{tech}</span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Cliente / Partner</h3>
            <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">{project.client || 'SICI INTERNAL'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Equipo de Desarrollo</h3>
          <div className="flex flex-wrap gap-4">
            {project.team.map(member => (
              <Link 
                key={member.userId} 
                href={`/profile/${member.userId}`}
                className="flex items-center gap-3 p-2 bg-surface-container-high border border-white/5 group hover:border-primary/30 transition-all"
              >
                <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">{member.name}</div>
                  <div className="text-[8px] text-outline uppercase tracking-widest">{member.role}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <Link href={`/incubator/${project.id}`} className="hud-button inline-flex items-center gap-2">
            Ver Detalles del Proyecto
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
