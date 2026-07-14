// Store mínimo fuera de React (patrón useSyncExternalStore) para que un solo
// listener de click global pueda marcar "navegación en curso" de forma
// síncrona, sin pasar por Context ni re-renderizar el árbol completo.
let pending = false;
const listeners = new Set<() => void>();

export function startProgress() {
  if (pending) return;
  pending = true;
  listeners.forEach((l) => l());
}

export function stopProgress() {
  if (!pending) return;
  pending = false;
  listeners.forEach((l) => l());
}

export function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getSnapshot() {
  return pending;
}
