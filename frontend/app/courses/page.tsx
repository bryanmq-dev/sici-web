'use client';

import React from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { courses } from '@/lib/data';
import Image from 'next/image';
import { Shield, Cpu, Globe, Zap, User, Clock, BookOpen, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
              <div className="hud-tag mb-4 inline-block">Learning_Platform_v1.8</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Cursos de <span className="text-primary glow-red">Especialización</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Aprende las tecnologías más demandadas del mercado con un enfoque práctico y orientado a proyectos de investigación.
              </p>
            </motion.div>
          </div>

          <div className="mb-16 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
              <input 
                type="text" 
                placeholder="BUSCAR CURSO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    activeCategory === cat 
                      ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(211,29,36,0.3)]' 
                      : 'bg-surface-container-high border-white/5 text-secondary hover:border-primary/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-6 cyber-border group relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 p-4 text-[8px] font-mono text-primary/30">COURSE_ID: {course.id}</div>
                
                <div className="aspect-video relative overflow-hidden cyber-border mb-6">
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className="hud-tag bg-primary/20 border-primary/40 text-primary">{course.duration}</span>
                  </div>
                </div>
                
                <div className="space-y-4 flex-grow flex flex-col">
                  <div>
                    <h3 className="text-xl font-display font-bold uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {course.name}
                    </h3>
                    <p className="text-[10px] text-outline font-mono uppercase tracking-widest mt-2 flex items-center gap-2">
                      <User className="w-3 h-3 text-primary" /> INSTRUCTOR: {course.instructorName}
                    </p>
                  </div>
                  
                  <p className="text-[12px] text-secondary font-body leading-relaxed opacity-70 flex-grow">
                    {course.description}
                  </p>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-outline uppercase tracking-widest">
                      <span className="flex items-center gap-2"><BookOpen className="w-3 h-3 text-primary" /> {course.syllabus.length} MÓDULOS</span>
                      <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-primary" /> {course.duration}</span>
                    </div>
                    
                    <Link href={`/courses/${course.id}`} className="hud-button w-full flex items-center justify-center gap-2">
                      Ver Programa Completo
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
