'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Rocket, Mail, Github, Twitter, Linkedin, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-primary/10 pt-32 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="w-14 h-14 relative group-hover:scale-110 transition-transform">
                <Image 
                  src="/logo-sociedad-definitive-edition.png" 
                  alt="SICI Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold tracking-tighter text-on-surface uppercase leading-none">SICI</span>
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] leading-none mt-1">UNIVALLE</span>
              </div>
            </Link>
            <p className="text-secondary text-sm leading-relaxed opacity-70 font-body">
              Impulsando la investigación, ciencia e innovación en la carrera de Ingeniería de Sistemas e Informática de UNIVALLE. El futuro se construye hoy.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="p-3 glass border border-primary/10 hover:border-primary/40 transition-all group">
                  <Icon className="w-4 h-4 text-secondary group-hover:text-primary transition-colors glow-red" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-primary font-mono font-bold mb-10 uppercase tracking-[0.5em] text-[10px]">Plataforma_Core</h4>
            <ul className="space-y-5">
              {['Proyectos', 'Artículos', 'Incubadora', 'Mentores', 'Foro', 'Ranking'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace('í', 'i')}`} className="text-secondary hover:text-primary transition-all text-xs uppercase tracking-widest font-mono flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-primary font-mono font-bold mb-10 uppercase tracking-[0.5em] text-[10px]">Comunidad_Sync</h4>
            <ul className="space-y-5">
              {['Equipo', 'Perfil', 'Eventos', 'Impacto', 'Contacto', 'Unirme'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-secondary hover:text-primary transition-all text-xs uppercase tracking-widest font-mono flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-primary font-mono font-bold mb-10 uppercase tracking-[0.5em] text-[10px]">Terminal_Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 text-xs text-secondary font-mono leading-relaxed">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 glow-red" />
                <span className="opacity-70">Campus UNIVALLE, Edificio de Ingeniería, Piso 4. <br />Cochabamba, Bolivia.</span>
              </li>
              <li className="flex items-center space-x-4 text-xs text-secondary font-mono">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 glow-red" />
                <span className="opacity-70">+591 4 4444444</span>
              </li>
              <li className="flex items-center space-x-4 text-xs text-secondary font-mono">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 glow-red" />
                <span className="opacity-70">sici@univalle.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-secondary text-[10px] font-mono uppercase tracking-widest opacity-50">
              © 2026 SICI UNIVALLE. ALL_RIGHTS_RESERVED.
            </p>
            <div className="text-[8px] font-mono text-primary/30 uppercase tracking-[0.5em]">SYSTEM_VERSION_4.2.0_STABLE</div>
          </div>
          <div className="flex space-x-10 text-[10px] font-mono uppercase tracking-widest text-secondary">
            <Link href="#" className="hover:text-primary transition-colors opacity-50 hover:opacity-100">Privacidad</Link>
            <Link href="#" className="hover:text-primary transition-colors opacity-50 hover:opacity-100">Términos</Link>
            <Link href="#" className="hover:text-primary transition-colors opacity-50 hover:opacity-100">Cookies</Link>
          </div>
        </div>
      </div>
      
      {/* Footer HUD decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </footer>
  );
}
