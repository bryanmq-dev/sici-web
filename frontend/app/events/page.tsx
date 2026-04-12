'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Countdown from '@/components/Countdown';
import EventCard from '@/components/EventCard';
import { events } from '@/lib/data';
import { 
  Calendar, MapPin, Users, Zap, 
  ArrowRight, ExternalLink, Trophy, 
  Clock, Globe, Shield, Cpu 
} from 'lucide-react';
import Image from 'next/image';

export default function EventsPage() {
  const nextEvent = events[0]; // CyberHack 2026

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Featured Event / Countdown */}
          <section className="mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 md:p-16 cyber-border relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent glow-red" />
              <div className="absolute top-4 left-4 text-[10px] font-mono text-primary/40 uppercase tracking-[0.3em]">PRÓXIMO_EVENTO_MAGNO</div>
              
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono uppercase tracking-widest">
                      <Trophy className="w-3 h-3" /> HACKATHON_2026
                    </div>
                    <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-on-surface leading-none">
                      {nextEvent.title}
                    </h2>
                    <p className="text-secondary text-lg font-body leading-relaxed opacity-80">
                      {nextEvent.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-mono text-secondary/40 uppercase tracking-widest text-center lg:text-left">INICIA_EN:</div>
                    <Countdown targetDate={nextEvent.date} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="hud-button px-12 py-4">REGISTRARSE_AHORA</button>
                    <button className="px-12 py-4 glass border border-white/10 text-[10px] font-mono uppercase tracking-widest hover:bg-white/5 transition-all">VER_BASES</button>
                  </div>
                </div>

                <div className="relative aspect-video cyber-border overflow-hidden group">
                  <Image 
                    src={nextEvent.image} 
                    alt={nextEvent.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 right-4 p-4 glass backdrop-blur-md border border-white/10 text-[10px] font-mono text-primary uppercase tracking-widest">
                    SICI_PROTOCOLO_EVENTO_01
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Events List */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-3xl font-display font-bold uppercase tracking-tighter text-on-surface">Calendario_de_Actividades</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </section>

          {/* Past Events / Archive */}
          <section className="mt-32 py-24 border-t border-white/5">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-display font-bold uppercase tracking-tighter text-on-surface">Archivo_de_Impacto</h2>
              <p className="text-secondary/60 font-body">Revive los momentos más importantes de nuestra sociedad.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square relative cyber-border overflow-hidden group grayscale hover:grayscale-0 transition-all cursor-pointer">
                  <Image 
                    src={`https://picsum.photos/seed/past-${i}/800/800`} 
                    alt="Past event"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <div className="text-[8px] font-mono text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">VER_MEMORIAS_2025</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
