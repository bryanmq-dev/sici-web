import { z } from 'zod';

export const execSummarySchema = z.object({
  titulo: z.string().optional(),
  introduccion: z.string().optional(),
  metodologia: z.string().optional(),
  resultados: z.string().optional(),
  conclusion: z.string().optional(),
});

export const createArticleSchema = z.object({
  title: z.string().min(1).max(255),
  abstract: z.string().min(1),
  content: z.string().optional(),
  researchArea: z.string().max(100).optional(),
  authorIds: z.array(z.string().uuid()).optional(),
  pdfUrl: z.string().max(500).optional(),
  image: z.string().max(500).optional(),
  execSummary: execSummarySchema.optional(),
});

export const updateArticleSchema = createArticleSchema.partial();
