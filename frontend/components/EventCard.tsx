'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
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
      className="card overflow-hidden group h-full flex flex-col"
    >
      <div className="aspect-video relative overflow-hidden">
        <Image 
          src={event.image} 
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute top-3 right-3 badge ${
          event.type === 'hackathon' ? 'badge-primary' :
          event.type === 'webinar' ? 'badge-secondary' :
          'badge-secondary'
        }`}>
          {event.type}
        </div>
      </div>

      <div className="p-5 space-y-3 flex-grow flex flex-col">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Clock className="w-3.5 h-3.5" /> 
          {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>

        <p className="text-sm text-text-secondary line-clamp-2">
          {event.description}
        </p>

        <div className="pt-3 border-t border-border flex justify-between items-center mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <MapPin className="w-3.5 h-3.5" /> UNIVALLE
          </div>
          <Link href={`/events/${event.id}`} className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
            Detalles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
