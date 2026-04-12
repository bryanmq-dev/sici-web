'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { Event } from '@/lib/data';

interface EventCardProps {
  event: Event;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass cyber-border overflow-hidden group hover:border-primary/50 transition-all h-full flex flex-col"
    >
      <div className="aspect-video relative overflow-hidden">
        <Image 
          src={event.image} 
          alt={event.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute top-4 right-4 hud-badge ${
          event.type === 'hackathon' ? 'hud-badge-primary' :
          event.type === 'webinar' ? 'hud-badge-cyan' :
          'hud-badge-outline'
        }`}>
          {event.type}
        </div>
      </div>

      <div className="p-8 space-y-6 flex-grow flex flex-col">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[8px] font-mono text-primary uppercase tracking-widest">
            <Clock className="w-3 h-3" /> {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h3 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </div>

        <p className="text-[11px] text-secondary/70 font-body leading-relaxed line-clamp-2">
          {event.description}
        </p>

        <div className="pt-6 border-t border-white/5 flex justify-between items-center mt-auto">
          <div className="flex items-center gap-2 text-[8px] font-mono text-secondary/40 uppercase tracking-widest">
            <MapPin className="w-3 h-3" /> UNIVALLE_SICI_HUB
          </div>
          <button className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1">
            DETALLES <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
