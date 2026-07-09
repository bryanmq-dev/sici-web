import * as THREE from 'three';

export interface InteractionPoint {
  position: THREE.Vector3;
  label: string;
}

export const interactionPoints: InteractionPoint[] = [];

// Convención en Blender: un Empty (o cualquier objeto liviano, no colisiona porque
// no es mesh) llamado "Interact_<Etiqueta>" — ej. "Interact_Escaleras" — marca un
// punto que cambia de piso. Ya NO se parsea un piso destino del nombre (esa fue la
// fuente de tres bugs distintos: sufijos ".001" de Blender, y glTF que además le
// quita el punto al exportar). Como solo hay 2 pisos, Scene3D.tsx alterna directo
// piso3<->piso4 sin importar el nombre exacto del objeto.
//
// "Interact_Luz_*" se excluye a propósito: son switches de luz (ver lights.ts), no
// cambios de piso, y comparten el mismo prefijo "Interact_".
export function rebuildInteractions(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  interactionPoints.length = 0;
  root.traverse((obj) => {
    if (!obj.name.startsWith('Interact_') || /^interact_luz_/i.test(obj.name)) return;
    const parts = obj.name.split('_');
    const label = parts.slice(1).join(' ').replace(/\.\d+$/, '') || 'Interactuar';
    const position = new THREE.Vector3();
    obj.getWorldPosition(position);
    interactionPoints.push({ position, label });
  });
}
