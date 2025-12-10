import { z } from 'zod';

export const createAttemptSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time'),
  response: z.record(z.any()).or(z.array(z.any())),
});

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>;
