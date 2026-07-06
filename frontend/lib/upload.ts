import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { ValidationError } from '@/lib/errors';

// Fuera de public/: en un contenedor, un archivo escrito en runtime dentro de public/
// no sobrevive un rebuild/redeploy (se hornea en la imagen). Se sirve vía
// app/api/uploads/[...path]/route.ts contra el volumen montado en UPLOADS_DIR.
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/app/uploads';

export type UploadSubdir = 'images' | 'pdfs' | 'avatars' | 'syllabus';

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
};

export async function saveUploadedFile(
  file: File,
  opts: { subdir: UploadSubdir; allowedTypes: string[]; maxSizeBytes: number }
): Promise<{ url: string }> {
  if (!opts.allowedTypes.includes(file.type)) {
    throw new ValidationError(`Tipo de archivo no permitido: ${file.type}`);
  }
  if (file.size > opts.maxSizeBytes) {
    throw new ValidationError(`El archivo excede el tamaño máximo permitido (${Math.floor(opts.maxSizeBytes / 1_000_000)}MB)`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Nombre aleatorio: nunca se usa el nombre provisto por el cliente en el filesystem
  // (cierra path traversal y colisiones/overwrite).
  const ext = EXT_BY_MIME[file.type] || path.extname(file.name).toLowerCase();
  const filename = `${randomUUID()}${ext}`;

  const dir = path.join(UPLOADS_DIR, opts.subdir);
  const destination = path.join(dir, filename);

  // Defensa en profundidad: confirma que la ruta resuelta sigue dentro de UPLOADS_DIR.
  if (!destination.startsWith(path.join(UPLOADS_DIR) + path.sep)) {
    throw new ValidationError('Ruta de destino inválida');
  }

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(destination, buffer);

  return { url: `/api/uploads/${opts.subdir}/${filename}` };
}
