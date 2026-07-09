import * as THREE from 'three';

// Cajas colisionables del modelo cargado — Player.tsx las usa cada frame para
// bloquear el movimiento horizontal. Todo mesh cuenta como colisionable salvo
// el piso (nombrado "Floor"/"Piso"/"Suelo" en Blender) y las puertas (nombradas
// "Puerta*"), que gestiona doors.ts por separado ya que se pueden abrir.
export const colliders: THREE.Box3[] = [];

// Hitbox orientada (rotada) — para muros que no están alineados a los ejes
// (la universidad tiene pasillos con ángulo real, no es un bug). Un Box3
// mundial de un mesh rotado infla su huella a un cuadrado que cubre el hueco
// de aire alrededor; esto guarda la caja en el espacio LOCAL del muro
// (sin rotar) más el ángulo, para probar la colisión ahí adentro.
export interface WallOBB {
  centerX: number;
  centerZ: number;
  halfX: number;
  halfZ: number;
  cos: number;
  sin: number;
  yMin: number;
  yMax: number;
}
export const orientedColliders: WallOBB[] = [];

// Tolerancia para considerar una rotación "limpia" (0/90/180/270°) y usar el
// Box3 barato de siempre. Generosa a propósito (~2°): varios muros del modelo
// tienen un desvío mínimo de exportación (ruido de punto flotante, no diseño)
// que con una tolerancia más ajustada disparaba el camino OBB en decenas de
// muros que en la práctica sí están alineados a los ejes.
const AXIS_ALIGN_EPSILON = 0.035; // ~2°

function isAxisAligned(yRotation: number): boolean {
  const mod = THREE.MathUtils.euclideanModulo(yRotation, Math.PI / 2);
  return mod < AXIS_ALIGN_EPSILON || Math.PI / 2 - mod < AXIS_ALIGN_EPSILON;
}

// Blender exporta cada puerta como un Group contenedor con el mesh real en un
// hijo sin relación de nombre (ej. "Cube276") — filtrar solo por el nombre del
// propio objeto dejaba ese mesh hijo colisionando SIEMPRE, incluso con la
// puerta abierta (doors.ts solo sabe quitar la caja del Group, no la de sus
// hijos). Se recorre hacia arriba por si "puerta" está en algún ancestro.
function isInsideDoor(obj: THREE.Object3D): boolean {
  let node: THREE.Object3D | null = obj;
  while (node) {
    if (/^puerta/i.test(node.name)) return true;
    node = node.parent;
  }
  return false;
}

const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const _localCenter = new THREE.Vector3();
const _worldCenter = new THREE.Vector3();

export function rebuildColliders(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  colliders.length = 0;
  orientedColliders.length = 0;

  root.traverse((obj) => {
    if (
      !(obj as THREE.Mesh).isMesh ||
      /floor|piso|suelo/i.test(obj.name) ||
      isInsideDoor(obj)
    ) {
      return;
    }

    obj.matrixWorld.decompose(_pos, _quat, _scale);
    _euler.setFromQuaternion(_quat, 'YXZ');

    if (isAxisAligned(_euler.y)) {
      colliders.push(new THREE.Box3().setFromObject(obj));
      return;
    }

    const mesh = obj as THREE.Mesh;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const bb = mesh.geometry.boundingBox!;
    bb.getCenter(_localCenter);
    _worldCenter.copy(_localCenter).applyMatrix4(obj.matrixWorld);

    const halfX = ((bb.max.x - bb.min.x) / 2) * _scale.x;
    const halfZ = ((bb.max.z - bb.min.z) / 2) * _scale.z;
    const halfY = ((bb.max.y - bb.min.y) / 2) * _scale.y;

    orientedColliders.push({
      centerX: _worldCenter.x,
      centerZ: _worldCenter.z,
      halfX,
      halfZ,
      cos: Math.cos(_euler.y),
      sin: Math.sin(_euler.y),
      yMin: _worldCenter.y - halfY,
      yMax: _worldCenter.y + halfY,
    });
  });
}
