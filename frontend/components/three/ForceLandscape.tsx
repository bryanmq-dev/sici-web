'use client';

import { useEffect, useState } from 'react';
import { useIsTouchDevice } from '@/hooks/use-touch-device';

// Bloquea el modo 3D en portrait para dispositivos táctiles: el joystick +
// panel de mirar necesitan el ancho extra de landscape para no pisarse entre
// sí ni con el HUD. screen.orientation.lock() solo funciona en fullscreen y en
// pocos navegadores, así que el bloqueo real es este overlay — el lock es solo
// un intento silencioso de mejor esfuerzo, no algo de lo que dependamos.
// Gateado también por touch (no solo portrait) para no molestar a alguien en
// desktop con la ventana angosta.
export default function ForceLandscape() {
  const isTouch = useIsTouchDevice();
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(orientation: portrait)');
    const update = () => setIsPortrait(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  function requestLandscape() {
    const el = document.documentElement;
    el.requestFullscreen?.()
      .then(() => (screen.orientation as unknown as { lock?: (o: string) => Promise<void> })?.lock?.('landscape'))
      .catch(() => {});
  }

  if (!isTouch || !isPortrait) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black text-center px-8">
      <div className="text-4xl animate-pulse">📱↻</div>
      <p className="text-sm text-white/80 max-w-xs">
        Girá tu dispositivo a horizontal para explorar el campus en 3D
      </p>
      <button
        type="button"
        onClick={requestLandscape}
        className="text-xs text-white/60 underline underline-offset-4"
      >
        Forzar pantalla completa
      </button>
    </div>
  );
}
