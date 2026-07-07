import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Server actions llamadas directamente (no vía <form action>) pierden el mensaje real en
// producción si el error no se atrapa en el cliente y llega sin envolver al error boundary
// (se ve como "Application error"). Este helper, usado en cada catch de un formulario,
// evita eso y además explica errores de Zod (ZodError.message es JSON crudo por defecto).
export function getErrorMessage(err: unknown): string {
  if (err instanceof z.ZodError) {
    return err.issues[0]?.message || 'Datos inválidos';
  }
  // En producción, Next.js reemplaza el mensaje real de cualquier error no atrapado que
  // escale desde un Server Component/Action por este texto genérico (protección contra
  // fugas de info sensible) — mostrarlo tal cual confunde más que ayuda.
  if (err instanceof Error && err.message?.includes('Server Components render')) {
    return 'Ocurrió un error. Si no has iniciado sesión, inicia sesión e intenta de nuevo.';
  }
  if (err instanceof Error && err.message && !err.message.startsWith('[')) {
    return err.message;
  }
  return 'Ocurrió un error. Intenta de nuevo.';
}

// "Secretario de Investigación" + gender='F' -> "Secretaria de Investigación".
// Solo reemplaza la terminación "o"/"a" de la primera palabra del título (Secretario/Vocal/etc).
export function genderizeTitle(title: string, gender?: string | null): string {
  if (gender !== 'F') return title;
  return title.replace(/^(\S*?)o(\b)/, '$1a$2');
}
