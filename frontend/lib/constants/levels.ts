// Umbrales de isipoints por nivel — valores iniciales, ajustables sin tocar el resto del código.
export const LEVELS = [
  { name: 'Junior', minPoints: 0 },
  { name: 'Dev Master', minPoints: 500 },
  { name: 'Gonzalord', minPoints: 1500 },
  { name: 'Quantum Coder', minPoints: 3500 },
  { name: 'SENIOR SOCEISI', minPoints: 7000 },
] as const;

export function getLevelForPoints(points: number): (typeof LEVELS)[number] {
  let current: (typeof LEVELS)[number] = LEVELS[0];
  for (const level of LEVELS) {
    if (points >= level.minPoints) current = level;
  }
  return current;
}
