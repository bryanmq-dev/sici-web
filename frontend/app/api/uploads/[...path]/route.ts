import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const UPLOADS_DIR = process.env.UPLOADS_DIR || '/app/uploads';

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  const requested = path.join(UPLOADS_DIR, ...segments);
  // Rechaza cualquier intento de salir de UPLOADS_DIR (p.ej. `..` en la ruta).
  if (!requested.startsWith(path.join(UPLOADS_DIR) + path.sep)) {
    return new NextResponse('Not found', { status: 404 });
  }

  let file: Buffer;
  try {
    file = await fs.readFile(requested);
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }

  const ext = path.extname(requested).toLowerCase();
  const contentType = CONTENT_TYPE_BY_EXT[ext] || 'application/octet-stream';
  const isPdf = ext === '.pdf';

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': isPdf ? 'private, max-age=3600' : 'public, max-age=31536000, immutable',
      ...(isPdf ? { 'Content-Disposition': 'attachment' } : {}),
    },
  });
}
