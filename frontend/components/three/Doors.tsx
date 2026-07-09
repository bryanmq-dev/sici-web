'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { doors, applyDoorAngle } from './doors';

// Anima el ángulo de cada puerta hacia su objetivo (abierta/cerrada) — nada
// que renderizar, solo mueve/rota los objetos ya registrados por rebuildDoors.
export default function Doors() {
  useFrame((_, delta) => {
    for (const door of doors) {
      if (Math.abs(door.currentAngle - door.targetAngle) > 0.001) {
        const next = THREE.MathUtils.lerp(door.currentAngle, door.targetAngle, Math.min(1, delta * 6));
        applyDoorAngle(door, next);
      }
    }
  });
  return null;
}
