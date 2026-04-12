'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RankingPodiumCard from '@/components/RankingPodiumCard';
import RankingListItem from '@/components/RankingListItem';
import { ranking } from '@/lib/data';
import Image from 'next/image';
import { Trophy, Shield, Cpu, Globe, Zap, User, Star, ArrowUpRight, Code2, Microscope, Medal, Award, Search } from 'lucide-react';
import Link from 'next/link';

export default function RankingPage() {
  const [activeCategory, setActiveCategory] = useState<'dev' | 'research'>('dev');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRanking = ranking.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRanking = [...filteredRanking].sort((a, b) => 
    activeCategory === 'dev' ? b.devScore - a.devScore : b.researchScore - a.researchScore
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="hud-tag mb-4 inline-block">SICI_NETWORK // RANKING_SYSTEM_V2.0</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase text-on-surface">
                Cuadro de <span className="text-primary glow-red">Honor</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Reconociendo la excelencia técnica y el rigor investigativo de nuestra comunidad.
              </p>
            </motion.div>
          </div>

          {/* Search and Category Toggle */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/50" />
              <input 
                type="text" 
                placeholder="BUSCAR MIEMBRO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container border border-outline/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-on-surface uppercase"
              />
            </div>

            <div className="glass p-1 cyber-border flex gap-1">
              <button
                onClick={() => setActiveCategory('dev')}
                className={`flex items-center gap-3 px-8 py-4 text-[10px] font-mono uppercase tracking-widest transition-all ${
                  activeCategory === 'dev' ? 'bg-primary text-white dark:text-black' : 'text-secondary hover:text-primary'
                }`}
              >
                <Code2 className="w-4 h-4" />
                DevCore Points
              </button>
              <button
                onClick={() => setActiveCategory('research')}
                className={`flex items-center gap-3 px-8 py-4 text-[10px] font-mono uppercase tracking-widest transition-all ${
                  activeCategory === 'research' ? 'bg-primary text-white dark:text-black' : 'text-secondary hover:text-primary'
                }`}
              >
                <Microscope className="w-4 h-4" />
                Insight Points
              </button>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-end">
            {/* Rank 2 */}
            <div className="order-2 md:order-1">
              <RankingPodiumCard 
                user={sortedRanking[1]} 
                position={2} 
                category={activeCategory}
                delay={0.1}
              />
            </div>
            {/* Rank 1 */}
            <div className="order-1 md:order-2">
              <RankingPodiumCard 
                user={sortedRanking[0]} 
                position={1} 
                category={activeCategory}
                delay={0}
                isMain
              />
            </div>
            {/* Rank 3 */}
            <div className="order-3 md:order-3">
              <RankingPodiumCard 
                user={sortedRanking[2]} 
                position={3} 
                category={activeCategory}
                delay={0.2}
              />
            </div>
          </div>

          {/* Full List */}
          <div className="glass cyber-border overflow-hidden">
            <div className="hidden md:grid grid-cols-12 p-6 bg-surface-container-high border-b border-outline/10 text-[10px] font-bold uppercase tracking-[0.2em] text-primary font-mono">
              <div className="col-span-1 text-center">Pos</div>
              <div className="col-span-4 px-4">Miembro</div>
              <div className="col-span-3 text-center">Rango DevCore</div>
              <div className="col-span-3 text-center">Rango Insight</div>
              <div className="col-span-1 text-right">Puntos</div>
            </div>
            
            <div className="divide-y divide-outline/5">
              {sortedRanking.slice(3).map((user, idx) => (
                <RankingListItem key={user.id} user={user} index={idx} category={activeCategory} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
