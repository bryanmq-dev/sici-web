'use client';

// react-three-fiber muta objetos de la escena de Three.js (no estado de React) de forma
// imperativa dentro de useFrame en cada frame — es el patrón estándar de la librería, y la
// regla de inmutabilidad del compilador de React no está pensada para este árbol de escena.
/* eslint-disable react-hooks/immutability */

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { colliders, orientedColliders } from './collision';
import { interactionPoints } from './interactions';
import { doors, toggleDoor, type Door } from './doors';
import { roomLights, toggleRoomLight, type RoomLight } from './lights';
import { touchMove, touchLook, touchInteract } from './touchControls';
import { useIsTouchDevice } from '@/hooks/use-touch-device';

const SPEED = 4;
const EYE_HEIGHT = 1.7;
const PLAYER_RADIUS = 0.3; // caja de colisión aproximada del jugador (no hay malla visible: cámara en 1a persona)
const BOB_FREQUENCY = 10; // "pasos" por segundo a velocidad de marcha normal
const BOB_AMPLITUDE = 0.035; // metros — deliberadamente sutil para no marear
const INTERACT_RADIUS = 1.5;
const TOUCH_LOOK_SENSITIVITY = 0.0035;
const PITCH_LIMIT = Math.PI / 2 - 0.01;

const playerBox = new THREE.Box3();
const flatDelta = new THREE.Vector3();

function collides(x: number, z: number) {
  playerBox.min.set(x - PLAYER_RADIUS, 0, z - PLAYER_RADIUS);
  playerBox.max.set(x + PLAYER_RADIUS, EYE_HEIGHT, z + PLAYER_RADIUS);
  if (colliders.some((box) => playerBox.intersectsBox(box))) return true;

  // Muros en ángulo (así está construido el edificio, no es un error): en vez
  // de tratarlos como el cuadrado que da su Box3 mundial, se prueba contra su
  // propio rectángulo rotado — se pasa el punto al espacio local del muro
  // (rotación inversa) y ahí adentro es un simple rectángulo-vs-rectángulo,
  // expandiendo el muro por el radio del jugador (aproximación suficiente,
  // no hace falta SAT completo para geometría estática tipo caja).
  return orientedColliders.some((wall) => {
    if (EYE_HEIGHT < wall.yMin || 0 > wall.yMax) return false;
    const dx = x - wall.centerX;
    const dz = z - wall.centerZ;
    const localX = dx * wall.cos - dz * wall.sin;
    const localZ = dx * wall.sin + dz * wall.cos;
    return Math.abs(localX) <= wall.halfX + PLAYER_RADIUS && Math.abs(localZ) <= wall.halfZ + PLAYER_RADIUS;
  });
}

interface PlayerProps {
  floor: string;
  spawnPoints: Record<string, [number, number, number]>;
  onNearbyChange: (label: string | null) => void;
  onInteract: () => void;
}

// Sin motor de física a propósito: el modelo es geometría estática simple (cajas),
// así que alcanza con Box3 contra cada muro (ver collision.ts) probando cada eje por
// separado — eso da "sliding" gratis contra la pared en vez de trabarse en seco.
export default function Player({ floor, spawnPoints, onNearbyChange, onInteract }: PlayerProps) {
  const { camera } = useThree();
  const isTouch = useIsTouchDevice();
  const [, getKeys] = useKeyboardControls();
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  const walkTime = useRef(0);
  const bobOffset = useRef(0);
  const nearbyTarget = useRef<string | null>(null);
  const wasInteractPressed = useRef(false);
  const isFirstFloor = useRef(true);
  // Yaw/pitch propios porque en touch no hay PointerLockControls (requiere mouse
  // lock, no aplica a dedo) — acá la cámara se rota a mano con el arrastre del
  // panel derecho de MobileControls, orden 'YXZ' para que el pitch no arrastre roll.
  const yaw = useRef(0);
  const pitch = useRef(0);

  // Al cambiar de piso (no en el montaje inicial, ese ya usa spawnPoints vía el
  // prop `camera.position` del Canvas) el jugador reaparece en el punto propio
  // de ese piso, no en un (0,0) genérico.
  useEffect(() => {
    if (isFirstFloor.current) {
      isFirstFloor.current = false;
      return;
    }
    const spawn = spawnPoints[floor];
    if (spawn) {
      camera.position.x = spawn[0];
      camera.position.z = spawn[2];
    }
  }, [floor, camera, spawnPoints]);

  // En touch, la cámara pasa a manejar su propio yaw/pitch (ver arriba) en vez
  // de que PointerLockControls la controle — hay que arrancar esos refs desde
  // la rotación real de la cámara, si no el primer arrastre la salta de golpe.
  useEffect(() => {
    if (!isTouch) return;
    camera.rotation.order = 'YXZ';
    yaw.current = camera.rotation.y;
    pitch.current = camera.rotation.x;
  }, [isTouch, camera]);

  useFrame((_, delta) => {
    if (isTouch) {
      yaw.current -= touchLook.dx * TOUCH_LOOK_SENSITIVITY;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - touchLook.dy * TOUCH_LOOK_SENSITIVITY,
        -PITCH_LIMIT,
        PITCH_LIMIT,
      );
      touchLook.dx = 0;
      touchLook.dy = 0;
      camera.rotation.set(pitch.current, yaw.current, 0);
    }

    const { forward, backward, left, right, interact } = getKeys();

    frontVector.current.set(0, 0, Number(backward) - Number(forward) + touchMove.forward);
    sideVector.current.set(Number(left) - Number(right) + touchMove.side, 0, 0);
    direction.current.subVectors(frontVector.current, sideVector.current);

    const isMoving = direction.current.lengthSq() > 0;

    // Evita normalizar un vector cero (NaN) cuando no hay ninguna tecla presionada.
    if (isMoving) {
      direction.current.normalize().multiplyScalar(SPEED * delta).applyEuler(camera.rotation);

      const nextX = camera.position.x + direction.current.x;
      if (!collides(nextX, camera.position.z)) {
        camera.position.x = nextX;
      }
      const nextZ = camera.position.z + direction.current.z;
      if (!collides(camera.position.x, nextZ)) {
        camera.position.z = nextZ;
      }
    }

    // Balanceo de caminata: leve rebote vertical que solo avanza mientras hay
    // movimiento, y se relaja suavemente al soltar las teclas.
    if (isMoving) {
      walkTime.current += delta * BOB_FREQUENCY;
      const target = Math.abs(Math.sin(walkTime.current)) * BOB_AMPLITUDE;
      bobOffset.current = THREE.MathUtils.lerp(bobOffset.current, target, 0.3);
    } else {
      bobOffset.current = THREE.MathUtils.lerp(bobOffset.current, 0, 0.15);
    }
    camera.position.y = EYE_HEIGHT + bobOffset.current;

    // Interactuable más cercano (escalera, puerta o switch de luz), distancia horizontal.
    let nearestStairs: (typeof interactionPoints)[number] | null = null;
    let nearestDoor: Door | null = null;
    let nearestLight: RoomLight | null = null;
    let nearestDist = INTERACT_RADIUS;
    for (const point of interactionPoints) {
      flatDelta.set(camera.position.x - point.position.x, 0, camera.position.z - point.position.z);
      const dist = flatDelta.length();
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestStairs = point;
        nearestDoor = null;
        nearestLight = null;
      }
    }
    for (const door of doors) {
      // basePosition (no door.object.position) porque esta última se mueve durante
      // la animación de apertura — la proximidad debe ser estable, no parpadear.
      flatDelta.set(camera.position.x - door.basePosition.x, 0, camera.position.z - door.basePosition.z);
      const dist = flatDelta.length();
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestDoor = door;
        nearestStairs = null;
        nearestLight = null;
      }
    }
    for (const roomLight of roomLights) {
      flatDelta.set(camera.position.x - roomLight.switchPosition.x, 0, camera.position.z - roomLight.switchPosition.z);
      const dist = flatDelta.length();
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestLight = roomLight;
        nearestDoor = null;
        nearestStairs = null;
      }
    }

    const nearbyKey = nearestDoor
      ? `door:${doors.indexOf(nearestDoor)}`
      : nearestLight
        ? `light:${roomLights.indexOf(nearestLight)}`
        : nearestStairs
          ? `stairs:${nearestStairs.position.x}:${nearestStairs.position.z}`
          : null;
    const interactHint = isTouch ? 'Tocá "Usar"' : 'Presiona E';
    if (nearbyKey !== nearbyTarget.current) {
      nearbyTarget.current = nearbyKey;
      if (nearestDoor) {
        onNearbyChange(`Puerta — ${interactHint} para ${nearestDoor.isOpen ? 'cerrar' : 'abrir'}`);
      } else if (nearestLight) {
        onNearbyChange(`Luz — ${interactHint} para ${nearestLight.isOn ? 'apagar' : 'prender'}`);
      } else if (nearestStairs) {
        // Solo 2 pisos: alterna piso3<->piso4, no depende del nombre del objeto.
        const otherFloor = floor === 'piso3' ? 'piso4' : 'piso3';
        onNearbyChange(`${nearestStairs.label} — ${interactHint} para ir a ${otherFloor}`);
      } else {
        onNearbyChange(null);
      }
    }

    // Flanco de subida: dispara una sola vez por pulsación/toque, no en cada
    // frame que siga apretado.
    const interactNow = interact || touchInteract.pressed;
    if (interactNow && !wasInteractPressed.current) {
      if (nearestDoor) toggleDoor(nearestDoor);
      else if (nearestLight) toggleRoomLight(nearestLight);
      else if (nearestStairs) onInteract();
    }
    wasInteractPressed.current = interactNow;
  });

  // Pointer lock requiere mouse (no aplica a touch); en mobile el look se maneja
  // a mano arriba con yaw/pitch a partir del arrastre de MobileControls.
  return isTouch ? null : <PointerLockControls />;
}
