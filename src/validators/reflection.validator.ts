import { z } from 'zod';

export const createReflectionSchema = z.object({
  content: z.string().min(10, 'Reflection must be at least 10 characters'),
  tags: z.array(z.string()).optional().default([]),
});

export type CreateReflectionInput = z.infer<typeof createReflectionSchema>;
