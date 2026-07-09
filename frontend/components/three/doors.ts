import * as THREE from 'three';
import { colliders } from './collision';
import { roomLights, setRoomLight, type RoomLight } from './lights';

const MAX_LINK_DISTANCE = 8; // no enlazar con una luz de otra sala lejana

export interface Door {
  object: THREE.Object3D;
  axis: 'x' | 'z';
  halfWidth: number;
  basePosition: THREE.Vector3;
  baseRotation: number;
  isOpen: boolean;
  currentAngle: number;
  targetAngle: number;
  closedBox: THREE.Box3;
  linkedLight: RoomLight | null;
}

export const doors: Door[] = [];

const OPEN_ANGLE = (Math.PI / 2) * 0.85; // ~76°, no del todo a 90° para que no quede pegada a la pared

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const hingeLocal = new THREE.Vector3();
const rotatedHinge = new THREE.Vector3();

// Cualquier objeto "Puerta*" se vuelve abrible — a propósito NO exige que sea un
// Mesh: Blender exporta cada puerta como un Group contenedor (el mesh real vive
// en un hijo tipo "Cube276" sin relación con el nombre), así que filtrar por
// isMesh rechazaba TODAS las puertas. Box3().setFromObject ya recorre hijos solo,
// y rotar el Group arrastra su mesh interno con él. Tampoco se excluye "ventana":
// al unir la ventana a la puerta en Blender (Ctrl+J), el resultado a veces hereda
// el nombre "Puerta_X_Ventana" (queda el que estaba activo al unir), no "Puerta_X".
// Se evita procesar un mismo grupo dos veces ignorando nodos cuyo padre directo
// ya matchea el mismo patrón (así no se cuenta un hijo con nombre coincidente).
export function rebuildDoors(root: THREE.Object3D) {
  doors.length = 0;
  root.updateMatrixWorld(true);

  root.traverse((obj) => {
    if (!/^puerta/i.test(obj.name)) return;
    if (obj.parent && /^puerta/i.test(obj.parent.name)) return;

    const box = new THREE.Box3().setFromObject(obj);
    const width = box.max.x - box.min.x;
    const depth = box.max.z - box.min.z;
    const axis: 'x' | 'z' = width >= depth ? 'x' : 'z';
    const halfWidth = (axis === 'x' ? width : depth) / 2;
    const closedBox = box.clone();

    doors.push({
      object: obj,
      axis,
      halfWidth,
      basePosition: obj.position.clone(),
      baseRotation: obj.rotation.y,
      isOpen: false,
      currentAngle: 0,
      targetAngle: 0,
      closedBox,
      linkedLight: null,
    });
    colliders.push(closedBox);
  });
}

// Empareja cada puerta con la luz de su propia aula por cercanía — no depende de
// que los nombres coincidan (las puertas no llevan el nombre de la sala). Debe
// llamarse DESPUÉS de rebuildDoors y rebuildLights (ver Environment3D.tsx).
export function linkDoorsToLights() {
  for (const door of doors) {
    let nearest: RoomLight | null = null;
    let nearestDist = MAX_LINK_DISTANCE;
    for (const roomLight of roomLights) {
      const dist = door.basePosition.distanceTo(roomLight.position);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = roomLight;
      }
    }
    door.linkedLight = nearest;
  }
}

export function applyDoorAngle(door: Door, angle: number) {
  hingeLocal.set(door.axis === 'x' ? -door.halfWidth : 0, 0, door.axis === 'z' ? -door.halfWidth : 0);
  rotatedHinge.copy(hingeLocal).applyAxisAngle(Y_AXIS, angle);
  door.object.position.copy(door.basePosition).add(hingeLocal).sub(rotatedHinge);
  // Suma sobre la rotación de cierre real de cada puerta (no todas nacen a 0°) —
  // fijar rotation.y = angle a secas descartaba esa orientación base y dejaba la
  // hoja "flotando" en un ángulo ajeno al marco para cualquier puerta no nacida a 0°.
  door.object.rotation.y = door.baseRotation + angle;
  door.currentAngle = angle;
}

export function toggleDoor(door: Door) {
  door.isOpen = !door.isOpen;
  door.targetAngle = door.isOpen ? OPEN_ANGLE : 0;
  const idx = colliders.indexOf(door.closedBox);
  if (door.isOpen && idx !== -1) colliders.splice(idx, 1);
  if (!door.isOpen && idx === -1) colliders.push(door.closedBox);

  // Abrir la puerta prende la luz de su aula; cerrarla la apaga con ella.
  if (door.linkedLight) setRoomLight(door.linkedLight, door.isOpen);
}
