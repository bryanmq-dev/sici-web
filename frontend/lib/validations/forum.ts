import { z } from 'zod';

export const createForumQuestionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export const createForumAnswerSchema = z.object({
  questionId: z.string().uuid(),
  content: z.string().min(1),
  images: z.array(z.string()).optional(),
  parentReplyId: z.string().uuid().optional(),
});
