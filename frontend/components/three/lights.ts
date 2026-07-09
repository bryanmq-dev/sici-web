import * as THREE from 'three';

export interface RoomLight {
  material: THREE.MeshStandardMaterial;
  light: THREE.PointLight;
  isOn: boolean;
  position: THREE.Vector3;
  switchPosition: THREE.Vector3;
  label: string;
}

export interface SensorLight {
  material: THREE.MeshStandardMaterial;
  light: THREE.PointLight;
  position: THREE.Vector3;
  remainingOn: number;
}

export const roomLights: RoomLight[] = [];
export const sensorLights: SensorLight[] = [];

export const ON_INTENSITY = 22;
export const ON_EMISSIVE = 8;
const LIGHT_DISTANCE = 18;

function attachLight(fixture: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(fixture);
  const center = box.getCenter(new THREE.Vector3());

  const light = new THREE.PointLight(0xfff4dd, 0, LIGHT_DISTANCE, 1.5);
  light.position.copy(center);
  fixture.parent?.add(light);

  const mesh = fixture as THREE.Mesh;
  // Blender puede compartir un mismo material entre varios fixtures — clonarlo
  // asegura que cada panel se prenda/apague de forma independiente.
  const original = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const material = (original as THREE.MeshStandardMaterial).clone();
  material.emissiveIntensity = 0;
  mesh.material = material;

  return { light, material };
}

// Convención en Blender: "Luz_<Sala>" (panel de techo) + "Interact_Luz_<Sala>"
// (Empty cerca de la puerta) = interruptor manual de esa aula. "LuzSensor_<N>"
// (sin Interact_) = luz de pasillo automática por proximidad, ver LightsAnimator.tsx.
export function rebuildLights(root: THREE.Object3D) {
  roomLights.length = 0;
  sensorLights.length = 0;

  const roomFixtures = new Map<string, THREE.Object3D>();
  const switches = new Map<string, THREE.Object3D>();
  const sensorFixtures: THREE.Object3D[] = [];

  root.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) {
      if (obj.name.startsWith('Interact_Luz_')) {
        switches.set(obj.name.slice('Interact_Luz_'.length).toLowerCase(), obj);
      }
      return;
    }
    if (/^luzsensor_/i.test(obj.name)) {
      sensorFixtures.push(obj);
    } else if (/^luz_/i.test(obj.name)) {
      roomFixtures.set(obj.name.slice('Luz_'.length).toLowerCase(), obj);
    }
  });

  for (const [key, fixture] of roomFixtures) {
    const switchObj = switches.get(key);
    if (!switchObj) continue;
    const { light, material } = attachLight(fixture);
    const position = new THREE.Vector3();
    fixture.getWorldPosition(position);
    const switchPosition = new THREE.Vector3();
    switchObj.getWorldPosition(switchPosition);
    roomLights.push({ material, light, isOn: false, position, switchPosition, label: key });
  }

  for (const fixture of sensorFixtures) {
    const { light, material } = attachLight(fixture);
    const position = new THREE.Vector3();
    fixture.getWorldPosition(position);
    sensorLights.push({ material, light, position, remainingOn: 0 });
  }
}

export function setRoomLight(roomLight: RoomLight, on: boolean) {
  roomLight.isOn = on;
  roomLight.light.intensity = on ? ON_INTENSITY : 0;
  roomLight.material.emissiveIntensity = on ? ON_EMISSIVE : 0;
}

export function toggleRoomLight(roomLight: RoomLight) {
  setRoomLight(roomLight, !roomLight.isOn);
}
