'use client';

import React, { createContext, useContext, useState } from 'react';

type ViewMode = '2d' | '3d';

interface ViewModeContextType {
  mode: ViewMode;
  toggleMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>('2d');

  const toggleMode = () => {
    setMode((prev) => (prev === '2d' ? '3d' : '2d'));
  };

  return (
    <ViewModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
