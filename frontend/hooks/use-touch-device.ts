import * as React from 'react';

// A propósito distinto de useIsMobile (ese mide ancho de viewport, que cambia
// al rotar a landscape). Este detecta la CAPACIDAD del dispositivo (puntero
// grueso / touch), así se mantiene estable sin importar la orientación —
// necesario para decidir si mostrar los controles táctiles del modo 3D.
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    const update = () => setIsTouch(mql.matches || navigator.maxTouchPoints > 0);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return isTouch;
}
