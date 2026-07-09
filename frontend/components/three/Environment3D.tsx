'use client';

// react-three-fiber muta la escena de Three.js (no estado de React) de forma imperativa
// (background/fog) — patrón estándar de la librería, incompatible con la regla de
// inmutabilidad del compilador de React.
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from 'three';
import { rebuildColliders } from './collision';
import { rebuildInteractions } from './interactions';
import { rebuildDoors, linkDoorsToLights } from './doors';
import { rebuildLights } from './lights';

export default function Environment3D({ floor }: { floor: string }) {
  const { scene } = useThree();
  // useGLTF cachea y comparte la MISMA instancia de escena entre montajes — rebuildDoors
  // mueve/rota objetos de la puerta y rebuildLights clona materiales, así que sin
  // clonar la escena, remontar el componente (salir y volver a entrar a modo 3D)
  // arrastraría el estado mutado del montaje anterior.
  const { scene: original } = useGLTF(`/models/${floor}.glb`);
  const campus = useMemo(() => original.clone(), [original]);

  // glTF no exporta el "World"/HDRI de Blender (no es parte del formato) — el
  // fondo de ciudad se carga acá directo en three.js. Se asigna SOLO a
  // `scene.background` (no `scene.environment`) a propósito: drei's <Environment>
  // usa la misma textura para iluminación por imagen (IBL) y eso era lo que
  // dejaba el interior blanco/iluminado sin importar si las luces estaban
  // apagadas — con esto el HDRI es puramente decorativo, se ve por las ventanas
  // pero no ilumina nada; las luces de techo (lights.ts) son la única fuente real.
  const hdri = useLoader(RGBELoader, '/hdri/shanghai_riverside.hdr');
  useEffect(() => {
    hdri.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = hdri;
    scene.fog = new THREE.Fog('#0A0A0A', 15, 70);
  }, [scene, hdri]);

  useEffect(() => {
    // Orden importa: rebuildColliders limpia y repuebla el array; rebuildDoors
    // agrega las suyas encima (colisión de puertas, gestionada aparte porque se abren).
    rebuildColliders(campus);
    rebuildInteractions(campus);
    rebuildDoors(campus);
    rebuildLights(campus);
    // Necesita que puertas y luces ya existan, para emparejar cada puerta con
    // la luz más cercana (su propia aula) y que abrirla la prenda.
    linkDoorsToLights();
  }, [campus]);

  // El otro piso (~20-30MB) se precarga recién acá, en tiempo ocioso, en vez
  // de junto con el piso activo — así el jugador puede moverse apenas termina
  // de bajar SU piso, no después de bajar los dos pisos a la vez.
  useEffect(() => {
    const other = floor === 'piso3' ? 'piso4' : 'piso3';
    const idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback : (cb: () => void) => setTimeout(cb, 2000);
    const cancel = typeof window.cancelIdleCallback === 'function' ? window.cancelIdleCallback : clearTimeout;
    const handle = idle(() => useGLTF.preload(`/models/${other}.glb`));
    return () => cancel(handle as never);
  }, [floor]);

  return (
    <>
      {/* Tenue a propósito: los paneles de techo (lights.ts) son la fuente de luz real,
          no un ambient plano — así prender/apagar una luz se nota, sin que quede
          tan oscuro como para sentirse un juego de terror. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[15, 20, 10]} intensity={0.4} />

      <primitive object={campus} />
    </>
  );
}
