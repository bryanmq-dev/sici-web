'use client';

// react-three-fiber muta objetos de la escena de Three.js (no estado de React) de forma
// imperativa dentro de useFrame en cada frame — es el patrón estándar de la librería, y la
// regla de inmutabilidad del compilador de React no está pensada para este árbol de escena.
/* eslint-disable react-hooks/immutability */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

const SPEED = 4;
const EYE_HEIGHT = 1.6;

// Sin física ni colisiones a propósito: cada frame se traslada la cámara en el plano
// horizontal según hacia dónde mira, y se fija la altura de ojos — sensación de "caminar"
// sin simular gravedad.
export default function Player() {
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const { forward, backward, left, right } = getKeys();

    frontVector.current.set(0, 0, Number(backward) - Number(forward));
    sideVector.current.set(Number(left) - Number(right), 0, 0);
    direction.current.subVectors(frontVector.current, sideVector.current);

    // Evita normalizar un vector cero (NaN) cuando no hay ninguna tecla presionada.
    if (direction.current.lengthSq() > 0) {
      direction.current.normalize().multiplyScalar(SPEED * delta).applyEuler(camera.rotation);
      camera.position.x += direction.current.x;
      camera.position.z += direction.current.z;
    }
    camera.position.y = EYE_HEIGHT;
  });

  return <PointerLockControls />;
}
