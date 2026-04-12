'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Menu, X, Rocket, Search, BookOpen, Users, MessageSquare, Trophy, Info, Mail, LayoutDashboard, User, GraduationCap, Calendar, Sun, Moon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAuth } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';

const navigation = [
  { name: 'Inicio', href: '/' },
  {
    name: 'Investigación',
    children: [
      { name: 'Proyectos', href: '/projects', icon: Search, desc: 'Explora desarrollos innovadores' },
      { name: 'Artículos', href: '/articles', icon: BookOpen, desc: 'Publicaciones científicas' },
      { name: 'Eventos', href: '/events', icon: Calendar, desc: 'Hackathons y conferencias' },
    ]
  },
  {
    name: 'Desarrollo',
    children: [
      { name: 'Incubadora', href: '/incubator', icon: Rocket, desc: 'Acelera tus ideas técnicas' },
      { name: 'Mentorías', href: '/mentorship', icon: GraduationCap, desc: 'Guía personalizada' },
    ]
  },
  {
    name: 'Comunidad',
    children: [
      { name: 'Foro', href: '/forum', icon: MessageSquare, desc: 'Resuelve dudas técnicas' },
      { name: 'Ranking', href: '/ranking', icon: Trophy, desc: 'Líderes de la sociedad' },
      { name: 'Mentores', href: '/mentors', icon: Users, desc: 'Expertos a tu disposición' },
    ]
  },
  {
    name: 'Sociedad',
    children: [
      { name: 'Equipo', href: '/team', icon: Info, desc: 'Conoce a la directiva' },
      { name: 'Contacto', href: '/contact', icon: Mail, desc: 'Canales de comunicación' },
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayNavItems = [...navigation];
  if (isAuthenticated) {
    displayNavItems.push({
      name: 'Mi Perfil',
      children: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, desc: 'Tu terminal de control' },
        { name: 'Perfil', href: '/profile', icon: User, desc: 'Gestión de identidad' },
      ]
    });
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'py-2' : 'py-6'
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 relative",
        scrolled ? "glass border-b border-primary/20 shadow-[0_0_30px_rgba(211,29,36,0.1)]" : "bg-transparent"
      )}>
        {/* HUD Decorative Lines */}
        {!scrolled && (
          <>
            <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-primary/40 to-transparent" />
            <div className="absolute top-0 left-0 w-px h-10 bg-gradient-to-b from-primary/40 to-transparent" />
            <div className="absolute top-0 right-0 w-20 h-px bg-gradient-to-l from-primary/40 to-transparent" />
            <div className="absolute top-0 right-0 w-px h-10 bg-gradient-to-b from-primary/40 to-transparent" />
          </>
        )}

        <div className="flex items-center h-20">
          {/* Left: Logo */}
          <div className="flex-shrink-0 w-1/4">
            <Link href="/" className="flex items-center space-x-4 group relative w-fit">
              <div className="w-12 h-12 relative group-hover:scale-110 transition-transform duration-500">
                <Image 
                  src="/logo-sociedad-definitive-edition.png" 
                  alt="SICI Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
                <div className="absolute -inset-2 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold tracking-tighter text-on-surface uppercase leading-none">SICI</span>
                <span className="text-[9px] font-mono text-primary uppercase tracking-[0.4em] leading-none mt-1">UNIVALLE</span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Menu */}
          <div className="hidden lg:flex flex-grow justify-center items-center">
            <div className="flex items-center space-x-1 glass px-2 py-1 border-primary/10 rounded-full">
              {displayNavItems.map((item) => (
                <div 
                  key={item.name} 
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.href ? (
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link
                        href={item.href}
                        className={cn(
                          'px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition-all relative group font-mono rounded-full overflow-hidden flex items-center gap-2',
                          pathname === item.href ? 'text-primary bg-primary/5' : 'text-secondary md:hover:text-on-surface'
                        )}
                      >
                        <span className="relative z-10">{item.name}</span>
                        {pathname === item.href && (
                          <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ) : (
                    <button
                      className={cn(
                        'px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition-all relative group font-mono rounded-full overflow-hidden flex items-center gap-2',
                        item.children?.some(child => pathname === child.href) ? 'text-primary' : 'text-secondary md:hover:text-on-surface'
                      )}
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", activeDropdown === item.name ? "rotate-180" : "")} />
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === item.name && item.children && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
                      >
                        <div className="bg-surface border border-primary/20 p-2 min-w-[240px] shadow-[0_0_40px_rgba(211,29,36,0.2)] rounded-xl overflow-hidden backdrop-blur-2xl">
                          <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
                          <div className="relative z-10 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  "flex items-start gap-4 p-3 rounded-lg transition-all group/item",
                                  pathname === child.href ? "bg-primary/10" : "hover:bg-primary/5"
                                )}
                              >
                                <div className="w-8 h-8 flex items-center justify-center glass border-primary/10 group-hover/item:border-primary/40 transition-colors">
                                  <child.icon className={cn("w-4 h-4", pathname === child.href ? "text-primary" : "text-secondary group-hover/item:text-primary")} />
                                </div>
                                <div>
                                  <div className={cn("text-[10px] font-bold uppercase tracking-widest mb-0.5", pathname === child.href ? "text-primary" : "text-on-surface")}>
                                    {child.name}
                                  </div>
                                  <div className="text-[8px] text-secondary/60 font-mono leading-tight">
                                    {child.desc}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex-shrink-0 w-1/4 flex items-center justify-end space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-secondary hover:text-primary transition-all glass border border-primary/10 hover:border-primary/40 group rounded-full"
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> : <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-500" />}
              </button>

              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="hud-button px-6 py-2.5 text-[9px] rounded-sm"
                >
                  Acceder_Sistema
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-secondary hover:text-primary transition-colors border border-outline/20 rounded-sm"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-secondary hover:text-on-surface p-2 glass border border-primary/10"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-50 glass backdrop-blur-xl border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between h-20 px-8 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 relative">
                  <Image 
                    src="/logo-sociedad-definitive-edition.png" 
                    alt="SICI Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-display font-bold tracking-tighter text-on-surface uppercase">SICI</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-secondary hover:text-on-surface p-2 border border-white/10 rounded-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto px-6 py-8 space-y-6">
              <div className="text-[8px] font-mono text-primary/40 uppercase tracking-[0.4em] px-3">Main_Navigation</div>
              
              {displayNavItems.map((item) => (
                <div key={item.name} className="space-y-3">
                  {item.href ? (
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center space-x-4 px-4 py-3 rounded-sm text-sm font-mono uppercase tracking-widest transition-all border border-transparent',
                          pathname === item.href 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'text-secondary active:bg-white/10 active:text-white'
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <div className="px-4 text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em] font-mono">
                        {item.name}
                      </div>
                      <div className="grid grid-cols-1 gap-2 pl-4">
                        {item.children?.map((child) => (
                          <motion.div key={child.name} whileTap={{ scale: 0.98 }}>
                            <Link
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'flex items-center space-x-4 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-widest transition-all border border-transparent',
                                pathname === child.href 
                                  ? 'bg-primary/10 text-primary border-primary/20' 
                                  : 'text-secondary active:bg-white/10 active:text-white'
                              )}
                            >
                              <child.icon className={cn("w-4 h-4", pathname === child.href ? "text-primary" : "text-secondary/50")} />
                              <span>{child.name}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-white/5 space-y-4">
              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="hud-button w-full py-4 flex justify-center text-sm"
                >
                  Acceder_Sistema
                </Link>
              )}
              <div className="text-center text-[7px] font-mono text-secondary/30 uppercase tracking-[0.5em]">
                SICI_MOBILE_INTERFACE_V4.0
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
