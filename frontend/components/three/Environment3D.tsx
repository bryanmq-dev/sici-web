'use client';

// react-three-fiber muta la escena de Three.js (no estado de React) de forma imperativa
// (background/fog) — patrón estándar de la librería, incompatible con la regla de
// inmutabilidad del compilador de React.
/* eslint-disable react-hooks/immutability */

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Piso/entorno placeholder: cuando el modelo real de la carrera esté listo, reemplazar el
// gridHelper + plano de abajo por:
//   const { scene } = useGLTF('/models/campus.glb');
//   return <primitive object={scene} />;
export default function Environment3D() {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color('#0A0A0A');
    scene.fog = new THREE.Fog('#0A0A0A', 15, 70);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[15, 20, 10]} intensity={1.1} />

      <gridHelper args={[200, 100, '#D31D24', '#262626']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow={false}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#171717" />
      </mesh>
    </>
  );
}
