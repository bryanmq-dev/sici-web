'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useViewMode } from '@/context/ViewModeContext';
import ViewModeToggle from '@/components/ViewModeToggle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Scene3D = dynamic(() => import('@/components/three/Scene3D'), { ssr: false });

// En modo 3D la página (y su Navbar) no se monta en absoluto: el modo 3D es
// una experiencia de pantalla completa aparte, no una vista superpuesta.
export default function ViewModeShell({ children }: { children: React.ReactNode }) {
  const { mode } = useViewMode();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (mode === '2d') {
    // El panel admin tiene su propio layout (AdminNav/AdminLogoutButton) y
    // no debe llevar el chrome público encima.
    if (isAdmin) {
      return <>{children}</>;
    }
    // Navbar/Footer viven aquí (no en cada page.tsx) para no desmontarse y
    // remontarse en cada navegación entre rutas 2D.
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col">{children}</div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-0">
        <Scene3D />
      </div>
      <ViewModeToggle className="fixed top-6 right-6 z-20 bg-background/95 backdrop-blur-md border border-border shadow-lg" />
    </>
  );
}
