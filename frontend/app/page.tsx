'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Rocket, Shield, Cpu, Globe, ArrowRight, ChevronRight, Zap, Instagram, Linkedin, Twitter, Github, Camera, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/lib/data';
import Image from 'next/image';

export default function LandingPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const heroImages = [
    'https://upload.wikimedia.org/wikipedia/commons/f/fb/Univalle_La_Paz.jpg',
    'https://picsum.photos/seed/sici-tech-1/1920/1080',
    'https://picsum.photos/seed/sici-tech-2/1920/1080',
    'https://picsum.photos/seed/sici-tech-3/1920/1080',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="relative selection:bg-primary/30 selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
        {/* Immersive Background Layers */}
        <div className="absolute inset-0 z-0">
          {/* Sequential Image Slideshow */}
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.5, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={heroImages[currentImage]}
                  alt={`Hero background ${currentImage}`}
                  fill
                  className="object-cover brightness-[0.9] dark:brightness-[0.7] contrast-[1.1]"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/10 to-background" />
                <div className="absolute inset-0 hidden dark:block bg-black/20" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute inset-0 cyber-grid opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          
          {/* Animated Glows */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.15, 0.05],
              x: [0, -30, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" 
          />
        </div>

        {/* HUD Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
          <div className="absolute top-1/4 left-10 w-4 h-px bg-primary/40" />
          <div className="absolute bottom-1/4 right-10 w-px h-32 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
          <div className="absolute bottom-1/4 right-10 w-4 h-px bg-primary/40" />
          
          {/* Floating Coordinates */}
          <div className="absolute top-40 left-20 font-mono text-[8px] text-primary/20 uppercase tracking-widest hidden lg:block">
            LOC_LAT: -12.0464<br />LOC_LNG: -77.0428
          </div>
          <div className="absolute bottom-40 right-20 font-mono text-[8px] text-primary/20 uppercase tracking-widest text-right hidden lg:block">
            SYS_CORE: STABLE<br />NODE_SYNC: 100%
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2 glass border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-10 font-mono relative group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              SYSTEM_STATUS // ONLINE // CONVOCATORIA_2024
              <div className="absolute -inset-1 bg-primary/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter mb-10 leading-[0.85] uppercase text-on-surface drop-shadow-2xl">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="block drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] dark:drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              >
                El Futuro de la
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-primary glow-red text-glow block mt-2"
              >
                Investigación
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-2xl mx-auto text-secondary text-base md:text-xl font-body mb-14 leading-relaxed opacity-80"
            >
              Sociedad de Investigación, Ciencia e Innovación. <br className="hidden md:block" />
              Forjando el mañana a través del código y la experimentación científica de vanguardia.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                href="/projects"
                className="w-full sm:w-auto hud-button px-14 py-5 flex items-center justify-center gap-3 group"
              >
                Explorar Proyectos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/join"
                className="w-full sm:w-auto px-14 py-5 glass hover:bg-primary/10 text-on-surface border border-primary/20 font-bold transition-all flex items-center justify-center uppercase tracking-[0.3em] text-[10px] font-mono group"
              >
                Iniciar Conexión
                <ChevronRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 opacity-50 font-mono">SICI_CORE_v2.0</span>
          <div className="w-px h-24 bg-gradient-to-b from-primary via-primary/20 to-transparent relative">
            <motion.div 
              animate={{ y: [0, 96, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary shadow-[0_0_8px_#D31D24]"
            />
          </div>
        </motion.div>
      </section>

      {/* News & Updates Section - Terminal Style */}
      <section className="py-32 border-y border-primary/10 bg-surface-container-low/20 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 flex items-center justify-center border border-primary/40 bg-primary/5 relative group">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
                <div className="absolute -inset-2 border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-primary font-mono">System_Logs</h2>
                <div className="text-[10px] text-secondary uppercase tracking-widest font-mono opacity-50">Real-time society data stream</div>
              </div>
            </div>
            <Link href="/articles" className="hud-button text-[8px] px-6 py-2">
              Access_Full_Logs
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { date: '2024.03.21', title: 'Nueva línea de IA Generativa', type: 'RESEARCH', status: 'STABLE' },
              { date: '2024.03.18', title: 'Simposio UNIVALLE 2024', type: 'EVENT', status: 'UPCOMING' },
              { date: '2024.03.15', title: 'Publicación: Quantum Computing', type: 'PAPER', status: 'ARCHIVED' },
              { date: '2024.03.10', title: 'Nuevos Mentores de Google', type: 'COMMUNITY', status: 'SYNCED' },
            ].map((news, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 glass border border-primary/5 hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20 group-hover:border-primary/60 transition-colors" />
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[10px] font-bold text-primary font-mono tracking-widest">{news.date}</div>
                  <div className="text-[8px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 font-mono">{news.status}</div>
                </div>
                <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-4 uppercase tracking-tight">{news.title}</h3>
                <div className="flex items-center gap-2 text-[8px] text-secondary font-mono tracking-widest">
                  <span className="w-1 h-1 bg-primary/40" />
                  TYPE: {news.type}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Immersive Layout */}
      <section className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-px bg-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.5em] text-primary font-mono">Core_Mission</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-display font-bold mb-12 tracking-tighter uppercase text-on-surface leading-none">
                Sobre la <br /><span className="text-primary glow-red text-glow">Sociedad</span>
              </h2>
              <div className="space-y-8 text-secondary text-lg font-body leading-relaxed opacity-80">
                <p>
                  La Sociedad de Investigación, Ciencia e Innovación (SICI) es el epicentro del desarrollo tecnológico en la carrera de Ingeniería de Sistemas e Informática de UNIVALLE.
                </p>
                <p>
                  Nuestra misión es fomentar el espíritu investigativo, proporcionando a los estudiantes las herramientas, mentorías y el ecosistema necesario para transformar ideas en soluciones reales de impacto global.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16">
                <div className="glass p-10 cyber-border border-primary/10 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-3 tracking-tighter">50+</div>
                  <div className="hud-tag">Active_Projects</div>
                </div>
                <div className="glass p-10 cyber-border border-primary/10 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-3 tracking-tighter">200+</div>
                  <div className="hud-tag">Active_Members</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square glass cyber-border flex items-center justify-center relative overflow-hidden border-primary/10">
                <div className="absolute inset-0 cyber-grid opacity-10" />
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                
                {/* Decorative HUD Circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-[80%] h-[80%] border border-dashed border-primary/20 rounded-full" 
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-[60%] h-[60%] border border-dashed border-primary/10 rounded-full" 
                  />
                </div>

                <div className="w-48 h-48 relative opacity-10">
                  <Image 
                    src="/logo-sociedad-definitive-edition.png" 
                    alt="SICI Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-8 p-12 relative z-10 w-full">
                  {[
                    { icon: Shield, label: 'SECURITY' },
                    { icon: Cpu, label: 'COMPUTE' },
                    { icon: Globe, label: 'NETWORK' },
                    { icon: Zap, label: 'ENERGY' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="glass p-10 cyber-border flex flex-col items-center justify-center border-primary/5 hover:border-primary/40 transition-all group cursor-pointer"
                    >
                      <item.icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform glow-red mb-4" />
                      <span className="text-[8px] font-mono text-primary/40 group-hover:text-primary transition-colors tracking-[0.3em]">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research Lines - Immersive Grid */}
      <section className="py-40 bg-surface-container-low/30 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tighter uppercase text-on-surface leading-none">
                Líneas de <br /><span className="text-primary glow-red text-glow">Investigación</span>
              </h2>
              <p className="text-secondary max-w-2xl mx-auto font-body text-xl opacity-70">Exploramos las fronteras de la tecnología a través de áreas clave de desarrollo científico.</p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Inteligencia Artificial', desc: 'Deep Learning, Visión por Computadora y Procesamiento de Lenguaje Natural aplicado a la resolución de problemas complejos.', icon: Cpu, id: '01', color: 'primary' },
              { title: 'Ciberseguridad', desc: 'Protección de infraestructuras críticas, criptografía avanzada y análisis de vulnerabilidades en sistemas distribuidos.', icon: Shield, id: '02', color: 'primary' },
              { title: 'Desarrollo Web3', desc: 'Blockchain, Smart Contracts y protocolos descentralizados para la nueva generación de la web semántica.', icon: Globe, id: '03', color: 'primary' },
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-12 cyber-border group relative overflow-hidden hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="absolute top-6 right-6 text-[10px] font-mono text-primary/30 group-hover:text-primary transition-colors tracking-widest">
                  SEC_PROTOCOL_{line.id}
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
                
                <div className="w-16 h-16 flex items-center justify-center glass border-primary/20 mb-10 group-hover:scale-110 transition-transform">
                  <line.icon className="w-8 h-8 text-primary glow-red" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-6 uppercase tracking-tight group-hover:text-primary transition-colors">{line.title}</h3>
                <p className="text-sm text-secondary font-body leading-relaxed opacity-70 mb-10">{line.desc}</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-primary animate-pulse" />
                  <div className="flex-grow h-px bg-primary/10 group-hover:bg-primary/30 transition-colors" />
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Immersive Masonry-like Grid */}
      <section className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-px bg-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.5em] text-primary font-mono">Visual_Archive</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase text-on-surface text-center md:text-right">
              Galería de <span className="text-primary glow-red text-glow">Impacto</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square relative cyber-border overflow-hidden group cursor-crosshair"
              >
                <Image
                  src={`https://picsum.photos/seed/sici-${i}/800/800`}
                  alt={`Gallery image ${i}`}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-background/90 backdrop-blur-md border-t border-primary/20 translate-y-full group-hover:translate-y-0 transition-transform">
                  <div className="text-[10px] font-mono text-primary text-center tracking-widest">IMG_DATA_STREAM_{i}</div>
                </div>
                
                {/* HUD Corners */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - Enhanced Cards */}
      <section className="py-40 bg-surface-container-low/20 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-on-surface leading-none">
                Proyectos <span className="text-primary glow-red text-glow">Destacados</span>
              </h2>
              <p className="text-secondary text-xl font-body opacity-70">Innovaciones disruptivas forjadas por nuestros miembros.</p>
            </div>
            <Link href="/projects" className="hud-button px-10 py-4 flex items-center gap-3 group">
              Ver Repositorio Completo
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {projects.slice(0, 3).map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section - Immersive Hub */}
      <section className="py-40 relative overflow-hidden border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tighter uppercase text-on-surface leading-none">
                Conecta con el <br /><span className="text-primary glow-red text-glow">Ecosistema</span>
              </h2>
              <p className="text-secondary max-w-2xl mx-auto font-body text-xl opacity-70">Síguenos en nuestras plataformas digitales para actualizaciones en tiempo real y contenido exclusivo de investigación.</p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'LinkedIn', icon: Linkedin, handle: '@sici-univalle', link: '#' },
              { name: 'Instagram', icon: Instagram, handle: '@sici.univalle', link: '#' },
              { name: 'Twitter', icon: Twitter, handle: '@SICI_Univalle', link: '#' },
              { name: 'GitHub', icon: Github, handle: 'SICI-Devs', link: '#' },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-10 cyber-border group relative overflow-hidden text-center hover:bg-primary/10 transition-all border-primary/5"
              >
                <div className="absolute top-3 right-3 text-[8px] font-mono text-primary/20 tracking-widest">LINK_ESTABLISHED</div>
                <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center glass border-primary/10 group-hover:border-primary/40 transition-colors">
                  <social.icon className="w-10 h-10 text-secondary group-hover:text-primary transition-colors glow-red" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-3">{social.name}</h3>
                <p className="text-[10px] font-mono text-primary/60 group-hover:text-primary transition-colors tracking-widest">{social.handle}</p>
                <div className="mt-8 flex justify-center">
                  <div className="hud-tag text-[9px] group-hover:bg-primary/20 group-hover:text-primary transition-all px-4 py-1">Seguir_Canal</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Final Protocol */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass backdrop-blur-xl p-20 md:p-32 cyber-border text-center relative overflow-hidden border-primary/20"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent glow-red" />
            <div className="absolute top-6 left-6 text-[10px] font-mono text-primary/40 tracking-[0.4em]">SICI_PROTOCOL_INITIATED</div>
            <div className="absolute bottom-6 right-6 text-[10px] font-mono text-primary/40 tracking-[0.4em]">v2.0.4_STABLE</div>
            
            <div className="relative z-10">
              <h2 className="text-6xl md:text-8xl font-display font-bold mb-12 tracking-tighter uppercase text-on-surface leading-none">
                ¿Listo para <br /><span className="text-primary glow-red text-glow">innovar</span>?
              </h2>
              <p className="text-secondary text-xl mb-16 max-w-2xl mx-auto font-body leading-relaxed opacity-70">
                Únete a la comunidad de investigadores más activa de UNIVALLE y empieza a desarrollar el futuro hoy mismo. El mañana se escribe en código.
              </p>
              <Link 
                href="/join"
                className="hud-button px-20 py-6 text-sm flex items-center justify-center gap-4 mx-auto group"
              >
                Iniciar Conexión
                <Rocket className="ml-3 w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Decorative HUD corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/20" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/20" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
