import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// "Secretario de Investigación" + gender='F' -> "Secretaria de Investigación".
// Solo reemplaza la terminación "o"/"a" de la primera palabra del título (Secretario/Vocal/etc).
export function genderizeTitle(title: string, gender?: string | null): string {
  if (gender !== 'F') return title;
  return title.replace(/^(\S*?)o(\b)/, '$1a$2');
}
