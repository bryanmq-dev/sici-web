// Cargos fijos de la directiva de la sociedad. "Vocal" aparece 2 veces = 2 asientos.
export const DIRECTIVE_ROLES = [
  'Presidente',
  'Vicepresidente',
  'Secretario de Directiva',
  'Secretario de Investigación',
  'Secretario de RSU e Interacción Social',
  'Secretario de Relaciones',
  'Secretario de Deportes y Cultura',
  'Vocal',
] as const;

export const MAX_VOCAL_SEATS = 2;

export type DirectiveRole = (typeof DIRECTIVE_ROLES)[number];
