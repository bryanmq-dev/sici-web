'use client';

import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

const MIN_VISIBLE_MS = 1000;

// Delay mínimo obligatorio: sin esto, un modelo ya cacheado por useGLTF.preload
// carga tan rápido que el loader ni se alcanza a ver — se pierde el feedback.
export default function Loader3D() {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);
  const [mountedAt] = useState(() => Date.now());

  useEffect(() => {
    if (active) return;
    const elapsed = Date.now() - mountedAt;
    const timer = setTimeout(() => setVisible(false), Math.max(0, MIN_VISIBLE_MS - elapsed));
    return () => clearTimeout(timer);
  }, [active, mountedAt]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/95 backdrop-blur-md">
      <div className="w-48 h-1.5 rounded-full bg-surface-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs font-mono text-text-muted">
        Cargando campus 3D... {Math.round(progress)}%
      </span>
    </div>
  );
}
