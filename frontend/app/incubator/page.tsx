'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IncubatorProjectCard from '@/components/IncubatorProjectCard';
import { incubatorProjects } from '@/lib/data';
import Image from 'next/image';
import { Rocket, Shield, Cpu, Globe, Zap, User, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function IncubatorPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeStatus, setActiveStatus] = React.useState('Todos');

  const statuses = ['Todos', 'Idea', 'MVP', 'Beta', 'Escalado'];

  const filteredProjects = incubatorProjects.filter(project => {
    const matchesStatus = activeStatus === 'Todos' || project.status === activeStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

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
              <div className="hud-tag mb-4 inline-block">Incubator_Program_v2.4</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Incubadora de <span className="text-primary glow-red">Desarrollo</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Transformando ideas audaces en soluciones tecnológicas escalables. Nuestro ecosistema de incubación proporciona mentoría, recursos y red de contactos.
              </p>
            </motion.div>
          </div>

          <div className="mb-16 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
              <input 
                type="text" 
                placeholder="BUSCAR PROYECTO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    activeStatus === status 
                      ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(211,29,36,0.3)]' 
                      : 'bg-surface-container-high border-white/5 text-secondary hover:border-primary/50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-32">
            {filteredProjects.map((project, idx) => (
              <IncubatorProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
