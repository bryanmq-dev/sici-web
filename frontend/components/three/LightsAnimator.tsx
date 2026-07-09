'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sensorLights, ON_INTENSITY, ON_EMISSIVE } from './lights';

const SENSOR_RADIUS = 2.5; // radio chico a propósito: que se note el efecto al caminar
const HOLD_SECONDS = 10;

const flatDelta = new THREE.Vector3();

// Luces de pasillo tipo sensor: se prenden solas al detectar al jugador cerca,
// quedan encendidas 10s desde la última detección, y se apagan solas si no
// hay nadie cerca — sin tecla, a diferencia de las luces de aula (ver Player.tsx).
export default function LightsAnimator() {
  const { camera } = useThree();

  useFrame((_, delta) => {
    for (const sensor of sensorLights) {
      flatDelta.set(camera.position.x - sensor.position.x, 0, camera.position.z - sensor.position.z);
      if (flatDelta.length() < SENSOR_RADIUS) {
        sensor.remainingOn = HOLD_SECONDS;
      } else if (sensor.remainingOn > 0) {
        sensor.remainingOn -= delta;
      }

      const targetOn = sensor.remainingOn > 0;
      const lerpFactor = Math.min(1, delta * 4);
      sensor.light.intensity = THREE.MathUtils.lerp(sensor.light.intensity, targetOn ? ON_INTENSITY : 0, lerpFactor);
      sensor.material.emissiveIntensity = THREE.MathUtils.lerp(sensor.material.emissiveIntensity, targetOn ? ON_EMISSIVE : 0, lerpFactor);
    }
  });

  return null;
}
