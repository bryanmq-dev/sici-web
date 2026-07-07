"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Menu,
  X,
  Search,
  BookOpen,
  Users,
  MessageSquare,
  Trophy,
  Info,
  Mail,
  LayoutDashboard,
  User,
  GraduationCap,
  Calendar,
  Sun,
  Moon,
  ChevronDown,
  Rocket,
  Code2,
  Cloud,
  Shield,
  HeartHandshake,
  Dumbbell,
  LogOut,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import { useViewMode } from "@/context/ViewModeContext";

const navigation = [
  { name: "Inicio", href: "/" },
  {
    name: "Investigación",
    children: [
      {
        name: "Proyectos",
        href: "/projects",
        icon: Search,
        desc: "Explora desarrollos innovadores",
      },
      {
        name: "Artículos",
        href: "/articles",
        icon: BookOpen,
        desc: "Publicaciones científicas",
      },
      {
        name: "Eventos",
        href: "/events",
        icon: Calendar,
        desc: "Hackathons y conferencias",
      },
    ],
  },
  {
    name: "Comunidad",
    children: [
      {
        name: "Incubadora",
        href: "/incubator",
        icon: Rocket,
        desc: "Acelera tus ideas técnicas",
      },
      {
        name: "Mentorías",
        href: "/mentorship",
        icon: GraduationCap,
        desc: "Guía personalizada",
      },
      {
        name: "Foro",
        href: "/forum",
        icon: MessageSquare,
        desc: "Resuelve dudas técnicas",
      },
      {
        name: "Cursos",
        href: "/courses",
        icon: BookOpen,
        desc: "Formación contínua",
      },
      {
        name: "Ranking",
        href: "/ranking",
        icon: Trophy,
        desc: "Líderes de la sociedad",
      },
      {
        name: "Mentores",
        href: "/mentors",
        icon: Users,
        desc: "Expertos a tu disposición",
      },
      {
        name: "Programación Competitiva",
        href: "/comunidad/programacion-competitiva",
        icon: Code2,
        desc: "Próximamente",
      },
      {
        name: "AWS Student Group",
        href: "/comunidad/aws-student-group",
        icon: Cloud,
        desc: "Próximamente",
      },
      {
        name: "Ciberseguridad",
        href: "/comunidad/ciberseguridad",
        icon: Shield,
        desc: "Próximamente",
      },
      {
        name: "Voluntariado",
        href: "/comunidad/voluntariado",
        icon: HeartHandshake,
        desc: "Próximamente",
      },
      {
        name: "ISI Sports",
        href: "/comunidad/isi-sports",
        icon: Dumbbell,
        desc: "Próximamente",
      },
    ],
  },
  {
    name: "Sociedad",
    children: [
      {
        name: "Equipo",
        href: "/team",
        icon: Info,
        desc: "Conoce a la directiva",
      },
      {
        name: "Contacto",
        href: "/contact",
        icon: Mail,
        desc: "Canales de comunicación",
      },
    ],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { mode, toggleMode } = useViewMode();

  const isAuthenticated = !!session;
  const isAdmin = session?.user?.role === "admin";
  const handleLogout = () => signOut({ callbackUrl: "/login" });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayNavItems = [...navigation];
  if (isAuthenticated) {
    displayNavItems.push({
      name: "Mi Perfil",
      children: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          desc: "Tu terminal de control",
        },
        {
          name: "Perfil",
          href: "/profile",
          icon: User,
          desc: "Gestión de identidad",
        },
      ],
    });
  }
  if (isAdmin) {
    displayNavItems.push({ name: "Panel Admin", href: "/admin" });
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300",
          scrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="flex items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 relative">
                <Image
                  src="/logo-sociedad-definitive-edition.png"
                  alt="SICI Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-bold tracking-tight text-text-primary leading-none">
                  SICI
                </span>
                <span className="text-[10px] font-mono text-text-muted leading-none mt-0.5">
                  UNIVALLE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-grow justify-center items-center ml-8">
            <div className="flex items-center gap-1">
              {displayNavItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                        pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
                      )}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1",
                        item.children?.some((child) => pathname === child.href)
                          ? "text-primary"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
                      )}
                    >
                      {item.name}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === item.name && item.children && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 pt-2 z-50"
                      >
                        <div className="bg-surface border border-border rounded-xl shadow-lg p-2 min-w-[220px]">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "flex items-start gap-3 p-3 rounded-lg transition-colors",
                                pathname === child.href
                                  ? "bg-primary/5"
                                  : "hover:bg-surface-hover",
                              )}
                            >
                              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-muted">
                                <child.icon
                                  className={cn(
                                    "w-4 h-4",
                                    pathname === child.href
                                      ? "text-primary"
                                      : "text-text-secondary",
                                  )}
                                />
                              </div>
                              <div>
                                <div
                                  className={cn(
                                    "text-sm font-medium",
                                    pathname === child.href
                                      ? "text-primary"
                                      : "text-text-primary",
                                  )}
                                >
                                  {child.name}
                                </div>
                                <div className="text-xs text-text-muted mt-0.5">
                                  {child.desc}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
              title={theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={toggleMode}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
              title={mode === "3d" ? "Volver a la vista normal" : "Explorar el campus en 3D"}
            >
              <Box className="w-4 h-4" />
            </button>

            {!isAuthenticated && (
              <Link
                href="/login"
                className="btn-primary px-4 py-2 text-sm hidden sm:inline-flex"
              >
                Acceder
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="btn-secondary px-4 py-2 text-sm hidden sm:inline-flex items-center gap-2 rounded-sm"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-surface border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {displayNavItems.map((item) => (
                <div key={item.name}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
                      )}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div className="space-y-1">
                      <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {item.name}
                      </div>
                      {item.children?.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors",
                            pathname === child.href
                              ? "text-primary bg-primary/5"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
                          )}
                        >
                          <child.icon className="w-4 h-4" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-border mt-4">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full py-3 text-sm"
                  >
                    Acceder
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <div className="pt-4 border-t border-border mt-4">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="btn-secondary w-full py-3 text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
