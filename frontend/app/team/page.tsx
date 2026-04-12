'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamMemberCard from '@/components/TeamMemberCard';
import { societyTeam } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Cpu, Globe, Zap, User } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hud-tag mb-4 inline-block">Society_Core_Team_v2.0</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Nuestro <span className="text-primary glow-red">Equipo</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Liderazgo multidisciplinario forjando el futuro de la ingeniería y la investigación en UNIVALLE.
              </p>
            </motion.div>
          </div>

          <div className="space-y-32">
            {societyTeam.map((section, sectionIdx) => (
              <section key={sectionIdx}>
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-px bg-primary" />
                  <h2 className="text-2xl font-display font-bold uppercase tracking-tighter text-primary">
                    {section.title}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {section.members.map((member, memberIdx) => (
                    <TeamMemberCard key={member.id} member={member} index={memberIdx} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
