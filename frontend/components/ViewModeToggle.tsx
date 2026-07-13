'use client';

import { Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useViewMode } from '@/context/ViewModeContext';

export default function ViewModeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useViewMode();

  return (
    <button
      onClick={toggleMode}
      className={cn(
        'p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover active:scale-95 rounded-lg transition-colors',
        className,
      )}
      title={mode === '3d' ? 'Volver a la vista normal' : 'Explorar el campus en 3D'}
    >
      <Box className="w-4 h-4" />
    </button>
  );
}
