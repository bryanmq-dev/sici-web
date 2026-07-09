"use client";

import { useRef } from "react";
import { touchMove, touchLook, touchInteract } from "./touchControls";

const JOYSTICK_RADIUS = 55; // px — recorrido máximo del stick desde el centro

// Overlay de controles táctiles: joystick de movimiento a la izquierda (arrastrar
// desde la base), panel de mirar a la derecha (arrastrar en cualquier punto), y
// un botón explícito de interacción — mismo rol que la tecla E en desktop, pero
// aquí no hay teclado. Solo se monta cuando useIsTouchDevice() es true (ver
// Scene3D.tsx), así que no hace falta gatear nada acá adentro.
export default function MobileControls() {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const joystickTouchId = useRef<number | null>(null);

  const lookTouchId = useRef<number | null>(null);
  const lastLook = useRef({ x: 0, y: 0 });

  function handleJoystickStart(e: React.PointerEvent) {
    e.preventDefault();
    joystickTouchId.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handleJoystickMove(e: React.PointerEvent) {
    if (joystickTouchId.current !== e.pointerId || !baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > JOYSTICK_RADIUS) {
      dx = (dx / dist) * JOYSTICK_RADIUS;
      dy = (dy / dist) * JOYSTICK_RADIUS;
    }
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    touchMove.side = -dx / JOYSTICK_RADIUS;
    touchMove.forward = dy / JOYSTICK_RADIUS;
  }

  function handleJoystickEnd(e: React.PointerEvent) {
    if (joystickTouchId.current !== e.pointerId) return;
    joystickTouchId.current = null;
    touchMove.forward = 0;
    touchMove.side = 0;
    if (knobRef.current)
      knobRef.current.style.transform = "translate(0px, 0px)";
  }

  function handleLookStart(e: React.PointerEvent) {
    e.preventDefault();
    lookTouchId.current = e.pointerId;
    lastLook.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handleLookMove(e: React.PointerEvent) {
    if (lookTouchId.current !== e.pointerId) return;
    touchLook.dx += e.clientX - lastLook.current.x;
    touchLook.dy += e.clientY - lastLook.current.y;
    lastLook.current = { x: e.clientX, y: e.clientY };
  }

  function handleLookEnd(e: React.PointerEvent) {
    if (lookTouchId.current !== e.pointerId) return;
    lookTouchId.current = null;
  }

  return (
    <div className="absolute inset-0 z-10 select-none touch-none">
      {/* Joystick de movimiento */}
      <div
        ref={baseRef}
        onPointerDown={handleJoystickStart}
        onPointerMove={handleJoystickMove}
        onPointerUp={handleJoystickEnd}
        onPointerCancel={handleJoystickEnd}
        className="absolute bottom-8 left-8 w-[130px] h-[130px] rounded-full bg-white/10 border border-white/20 touch-none"
      >
        <div
          ref={knobRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/40 border border-white/50"
          style={{ transform: "translate(0px, 0px)" }}
        />
      </div>

      {/* Panel de mirar: toda la mitad derecha, arrastrar rota la cámara */}
      <div
        onPointerDown={handleLookStart}
        onPointerMove={handleLookMove}
        onPointerUp={handleLookEnd}
        onPointerCancel={handleLookEnd}
        className="absolute inset-y-0 right-0 w-1/2 touch-none"
      />

      {/* Botón de interacción explícito (abrir puertas, luces, escaleras) */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          touchInteract.pressed = true;
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          touchInteract.pressed = false;
        }}
        onPointerCancel={(e) => {
          e.stopPropagation();
          touchInteract.pressed = false;
        }}
        className="absolute bottom-25 right-10 w-16 h-16 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium active:bg-white/35"
      >
        Usar
      </button>
    </div>
  );
}
