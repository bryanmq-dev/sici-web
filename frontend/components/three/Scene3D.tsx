'use client';

import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Environment3D from './Environment3D';
import Player from './Player';

const KEYBOARD_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
];

export default function Scene3D() {
  return (
    <div className="w-full h-full relative">
      <KeyboardControls map={KEYBOARD_MAP}>
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'low-power' }}
          camera={{ fov: 70, position: [0, 1.6, 5] }}
        >
          <Environment3D />
          <Player />
        </Canvas>
      </KeyboardControls>
      <div className="absolute top-6 left-6 text-xs text-white/70 bg-black/40 px-3 py-2 rounded-lg pointer-events-none">
        Click para activar el mouse · WASD para moverte
      </div>
    </div>
  );
}
