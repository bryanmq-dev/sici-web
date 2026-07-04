'use server';

import { requireAuth } from '@/lib/auth-helpers';
import { saveUploadedFile } from '@/lib/upload';

export async function uploadMentorshipSyllabus(formData: FormData) {
  await requireAuth();
  const file = formData.get('file');
  if (!(file instanceof File)) throw new Error('Archivo requerido');

  return saveUploadedFile(file, { subdir: 'syllabus', allowedTypes: ['application/pdf'], maxSizeBytes: 15_000_000 });
}

export async function uploadArticlePdf(formData: FormData) {
  await requireAuth();
  const file = formData.get('file');
  if (!(file instanceof File)) throw new Error('Archivo requerido');

  return saveUploadedFile(file, { subdir: 'pdfs', allowedTypes: ['application/pdf'], maxSizeBytes: 15_000_000 });
}

export async function uploadImage(formData: FormData) {
  await requireAuth();
  const file = formData.get('file');
  if (!(file instanceof File)) throw new Error('Archivo requerido');

  return saveUploadedFile(file, {
    subdir: 'images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSizeBytes: 5_000_000,
  });
}
