"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Github, Twitter, Linkedin, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-muted border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo-sociedad-definitive-edition.png"
                  alt="SICI Logo"
                  fill
                  className="object-contain"
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
            <p className="text-sm text-text-secondary leading-relaxed">
              Impulsando la investigación, ciencia e innovación en la carrera de
              Ingeniería de Sistemas e Informática de UNIVALLE.
            </p>
            <div className="flex gap-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2">
              {[
                "Proyectos",
                "Artículos",
                "Incubadora",
                "Mentores",
                "Foro",
                "Ranking",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace("í", "i")}`}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Comunidad
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Equipo", href: "/team" },
                { name: "Perfil", href: "/profile" },
                { name: "Eventos", href: "/events" },
                { name: "Contacto", href: "/contact" },
                { name: "Unirme", href: "/join" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-text-secondary">
                <Phone className="w-4 h-4 text-text-muted flex-shrink-0" />
                <span>+591 76741337</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-secondary">
                <Mail className="w-4 h-4 text-text-muted flex-shrink-0" />
                <span>siciaccount@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © 2026 SICI UNIVALLE. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-text-muted">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Términos
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
