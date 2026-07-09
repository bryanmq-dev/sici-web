'use client';

import dynamic from 'next/dynamic';
import { useViewMode } from '@/context/ViewModeContext';
import ViewModeToggle from '@/components/ViewModeToggle';

const Scene3D = dynamic(() => import('@/components/three/Scene3D'), { ssr: false });

// En modo 3D la página (y su Navbar) no se monta en absoluto: el modo 3D es
// una experiencia de pantalla completa aparte, no una vista superpuesta.
export default function ViewModeShell({ children }: { children: React.ReactNode }) {
  const { mode } = useViewMode();

  if (mode === '2d') {
    return <>{children}</>;
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
