'use client';

import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { useViewMode } from '@/context/ViewModeContext';

const Scene3D = dynamic(() => import('@/components/three/Scene3D'), { ssr: false });

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
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-10 w-80 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-2xl"
      >
        {children}
      </motion.div>
    </>
  );
}
