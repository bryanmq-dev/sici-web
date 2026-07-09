// Estado táctil compartido entre MobileControls.tsx (que lo escribe al arrastrar
// el joystick/mirar/tocar el botón) y Player.tsx (que lo lee cada frame junto al
// teclado) — mismo patrón de módulo mutable que colliders/doors/roomLights.

// forward: -1 (arriba, avanzar) a 1 (abajo, retroceder) — mismo signo que
// "backward - forward" del teclado, así Player.tsx solo suma sin invertir nada.
// side: -1 (derecha) a 1 (izquierda) — mismo signo que "left - right".
export const touchMove = { forward: 0, side: 0 };

// Delta de arrastre del panel de mirar, acumulado desde el último consumo en
// useFrame (Player.tsx lo resetea a 0 cada frame tras aplicarlo a la cámara).
export const touchLook = { dx: 0, dy: 0 };

export const touchInteract = { pressed: false };
