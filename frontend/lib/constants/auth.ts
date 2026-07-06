// Dominio institucional único para correos de estudiantes (ver db/seed.ts).
export const INSTITUTIONAL_EMAIL_DOMAIN = 'est.univalle.edu';

export function isInstitutionalEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${INSTITUTIONAL_EMAIL_DOMAIN}`);
}
