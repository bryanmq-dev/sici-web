'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { subscribe, getSnapshot, startProgress, stopProgress } from '@/lib/navigation-progress';

// Barra de progreso instantánea (patrón YouTube/Vercel): un solo listener de
// click a nivel de document marca "navegación en curso" de forma síncrona,
// antes de que Next.js empiece siquiera a pedir la ruta. El loading.tsx por
// ruta sigue existiendo como capa secundaria para cargas genuinamente lentas.
//
// El ancho/opacidad se maneja escribiendo directo al DOM (ref), no vía
// useState: es una animación imperativa (el mismo tipo de "sincronizar con un
// sistema externo" para el que existen los efectos), y evita re-renders en
// cascada por cada tick de la transición.
export default function NavigationProgress() {
  const pending = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const safetyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest?.('a');
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      startProgress();
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      stopProgress();
    }
  }, [pathname]);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    if (pending) {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.width = '0%';
      const raf1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'width 2000ms cubic-bezier(0.1,0.7,0.6,0.9), opacity 150ms ease-out';
          el.style.width = '85%';
        });
      });
      safetyTimeout.current = setTimeout(() => stopProgress(), 8000);
      return () => {
        cancelAnimationFrame(raf1);
        if (safetyTimeout.current) clearTimeout(safetyTimeout.current);
      };
    }

    if (safetyTimeout.current) clearTimeout(safetyTimeout.current);
    el.style.transition = 'width 200ms ease-out, opacity 300ms ease-out 150ms';
    el.style.width = '100%';
    el.style.opacity = '0';
    return undefined;
  }, [pending]);

  return (
    <div
      ref={barRef}
      aria-hidden
      className="fixed top-0 left-0 h-[3px] bg-primary z-[200] pointer-events-none opacity-0"
    />
  );
}
