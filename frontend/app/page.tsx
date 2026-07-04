'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Rocket, Shield, Cpu, Globe, ArrowRight, ChevronRight, Zap, Instagram, Linkedin, Twitter, Github, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/lib/data';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative selection:bg-primary/20 selection:text-text-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/20 text-primary text-xs font-medium rounded-full mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Convocatoria Abierta 2024
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 leading-tight text-text-primary">
              El Futuro de la
              <br />
              <span className="text-primary">Investigación</span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary mb-12 leading-relaxed"
            >
              Sociedad de Investigación, Ciencia e Innovación. Forjando el mañana a través del código y la experimentación científica de vanguardia.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                href="/projects"
                className="btn-primary px-8 py-3 text-sm"
              >
                Explorar Proyectos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/join"
                className="btn-secondary px-8 py-3 text-sm"
              >
                Únete a SICI
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-primary" />
                <span className="text-sm font-medium text-primary">Sobre Nosotros</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tight text-text-primary leading-tight">
                Sobre la <span className="text-primary">Sociedad</span>
              </h2>
              <div className="space-y-4 text-text-secondary text-base leading-relaxed">
                <p>
                  La Sociedad de Investigación, Ciencia e Innovación (SICI) es el epicentro del desarrollo tecnológico en la carrera de Ingeniería de Sistemas e Informática de UNIVALLE.
                </p>
                <p>
                  Nuestra misión es fomentar el espíritu investigativo, proporcionando a los estudiantes las herramientas, mentorías y el ecosistema necesario para transformar ideas en soluciones reales de impacto global.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="card p-6">
                  <div className="text-3xl font-display font-bold text-primary mb-1">50+</div>
                  <div className="text-sm text-text-secondary">Proyectos Activos</div>
                </div>
                <div className="card p-6">
                  <div className="text-3xl font-display font-bold text-primary mb-1">200+</div>
                  <div className="text-sm text-text-secondary">Miembros Activos</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-surface rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-2 gap-6 p-12 w-full">
                  {[
                    { icon: Shield, label: 'Seguridad' },
                    { icon: Cpu, label: 'Computación' },
                    { icon: Globe, label: 'Redes' },
                    { icon: Zap, label: 'Energía' }
                  ].map((item, i) => (
                    <div 
                      key={i}
                      className="card p-8 flex flex-col items-center justify-center hover:border-primary/30 transition-colors group cursor-pointer"
                    >
                      <item.icon className="w-10 h-10 text-text-secondary group-hover:text-primary transition-colors mb-3" />
                      <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research Lines */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight text-text-primary">
                Líneas de <span className="text-primary">Investigación</span>
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                Exploramos las fronteras de la tecnología a través de áreas clave de desarrollo científico.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Inteligencia Artificial', desc: 'Deep Learning, Visión por Computadora y Procesamiento de Lenguaje Natural aplicado a la resolución de problemas complejos.', icon: Cpu },
              { title: 'Ciberseguridad', desc: 'Protección de infraestructuras críticas, criptografía avanzada y análisis de vulnerabilidades en sistemas distribuidos.', icon: Shield },
              { title: 'Desarrollo Web3', desc: 'Blockchain, Smart Contracts y protocolos descentralizados para la nueva generación de la web semántica.', icon: Globe },
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-8 group hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary/5 rounded-xl mb-6 group-hover:bg-primary/10 transition-colors">
                  <line.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{line.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{line.desc}</p>
                
                <div className="flex items-center gap-2 mt-6 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explorar <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-text-primary">
                Proyectos <span className="text-primary">Destacados</span>
              </h2>
              <p className="text-text-secondary text-lg mt-3">Innovaciones disruptivas forjadas por nuestros miembros.</p>
            </div>
            <Link href="/projects" className="btn-outline px-6 py-2.5 text-sm">
              Ver Todos
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
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

      {/* Social Media */}
      <section className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight text-text-primary">
                Conecta con el <span className="text-primary">Ecosistema</span>
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                Síguenos en nuestras plataformas digitales para actualizaciones en tiempo real y contenido exclusivo.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="card p-6 text-center hover:border-primary/30 transition-all group"
              >
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-surface-muted rounded-xl group-hover:bg-primary/5 transition-colors">
                  <social.icon className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-base font-semibold mb-1">{social.name}</h3>
                <p className="text-sm text-text-muted">{social.handle}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface-muted border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-12 md:p-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-text-primary">
              ¿Listo para <span className="text-primary">innovar</span>?
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Únete a la comunidad de investigadores más activa de UNIVALLE y empieza a desarrollar el futuro hoy mismo.
            </p>
            <Link 
              href="/join"
              className="btn-primary px-10 py-4 text-base"
            >
              Únete a SICI
              <Rocket className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
