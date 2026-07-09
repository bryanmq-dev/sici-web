'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Environment3D from './Environment3D';
import Doors from './Doors';
import LightsAnimator from './LightsAnimator';
import Loader3D from './Loader3D';
import Player from './Player';
import MobileControls from './MobileControls';
import ForceLandscape from './ForceLandscape';
import { useIsTouchDevice } from '@/hooks/use-touch-device';

const DEFAULT_FLOOR = 'piso4';

const KEYBOARD_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'interact', keys: ['KeyE'] },
];

// Punto de aparición por piso (X, altura de ojos, Z). Para elegirlo: en Blender,
// Shift+click derecho sobre un punto abierto del piso mueve el cursor 3D ahí, y el
// panel N > View > "3D Cursor" muestra sus coordenadas (bx, by, bz). La conversión
// a este array es [bx, 1.7, -by] — el .glb exporta Z-up de Blender como Y-up.
const SPAWN_POINTS: Record<string, [number, number, number]> = {
  piso4: [3.307, 1.7, -0.882],
  piso3: [0.08109, 1.7, 0.6978],
};

export default function Scene3D() {
  const [floor, setFloor] = useState(DEFAULT_FLOOR);
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  const isTouch = useIsTouchDevice();

  return (
    <div className="w-full h-full relative">
      <KeyboardControls map={KEYBOARD_MAP}>
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'low-power' }}
          camera={{ fov: 70, position: SPAWN_POINTS[DEFAULT_FLOOR] }}
        >
          <Suspense fallback={null}>
            <Environment3D floor={floor} />
          </Suspense>
          <Player
            floor={floor}
            spawnPoints={SPAWN_POINTS}
            onNearbyChange={setNearbyLabel}
            onInteract={() => setFloor((f) => (f === 'piso3' ? 'piso4' : 'piso3'))}
          />
          <Doors />
          <LightsAnimator />
        </Canvas>
      </KeyboardControls>
      <Loader3D />
      {isTouch ? (
        <MobileControls />
      ) : (
        <div className="absolute top-6 left-6 text-xs text-white/70 bg-black/40 px-3 py-2 rounded-lg pointer-events-none">
          Click para activar el mouse · WASD para moverte
        </div>
      )}
      {nearbyLabel && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm text-white bg-black/60 px-4 py-2 rounded-lg pointer-events-none">
          {nearbyLabel}
        </div>
      )}
      <ForceLandscape />
    </div>
  );
}
