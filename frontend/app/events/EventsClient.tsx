'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import EventCard from '@/components/EventCard';
import EventCalendar from '@/components/EventCalendar';
import Countdown from '@/components/Countdown';
import ImpactGallery from '@/components/ImpactGallery';
import { Calendar, LayoutGrid, List, Images } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  eventType: string;
  image: string | null;
  link: string | null;
  location: string | null;
  status: string;
  createdAt: Date;
}

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
}

type ViewMode = 'cards' | 'calendar';

export default function EventsClient({ events, nextEvent, galleryImages }: { events: Event[]; nextEvent: Event | null; galleryImages: GalleryImage[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  return (
    <>
      {/* Próximo evento */}
      {nextEvent && (
        <div className="card p-8 md:p-12 mb-16 text-center">
          <div className="text-xs uppercase tracking-widest text-text-muted mb-2">Próximo evento</div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">{nextEvent.title}</h2>
          <Countdown targetDate={nextEvent.eventDate.toISOString()} />
        </div>
      )}

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-4xl font-bold text-text-primary">
            Calendario de Actividades
          </h1>
        </div>
        <p className="text-text-secondary text-lg">
          Explora los próximos eventos y actividades de la comunidad SICI
        </p>
      </div>

      {/* View Selector */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">
            {events.length} {events.length === 1 ? 'evento' : 'eventos'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 bg-surface-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'cards'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Cards
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'calendar'
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <List className="w-4 h-4" />
            Calendario
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'cards' ? (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, i) => (
                  <EventCard
                    key={event.id}
                    event={{
                      id: event.id,
                      title: event.title,
                      description: event.description,
                      date: event.eventDate.toISOString(),
                      type: event.eventType as any,
                      image: event.image || '/placeholder-event.jpg',
                    }}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted text-lg mb-2">
                  No hay eventos programados
                </p>
                <p className="text-text-muted text-sm">
                  Vuelve pronto para ver nuevos eventos
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <EventCalendar events={events} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Archivos de impacto */}
      <div className="mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Images className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Archivos de Impacto</h2>
        </div>
        <ImpactGallery images={galleryImages} />
      </div>
    </>
  );
}
