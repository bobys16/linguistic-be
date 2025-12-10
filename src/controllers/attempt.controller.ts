import { Request, Response } from 'express';
import { AttemptService } from '../services/attempt.service';
import { createAttemptSchema } from '../validators/attempt.validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';

const attemptService = new AttemptService();

export const createAttempt = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  const data = createAttemptSchema.parse(req.body);
  
  const attempt = await attemptService.createAttempt(userId, data);

  res.status(201).json({
    status: 'success',
    data: { attempt },
  });
});

export const getLatestAttempts = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  
  const attempts = await attemptService.getLatestAttempts(userId, limit);

  res.json({
    status: 'success',
    data: { attempts },
  });
});

export const getAttemptSummary = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  
  const summary = await attemptService.getAttemptSummary(userId);

  res.json({
    status: 'success',
    data: { summary },
  });
});

export const getAttemptsByTask = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  const { taskId } = req.params;
  
  const attempts = await attemptService.getAttemptsByTaskId(userId, taskId);

  res.json({
    status: 'success',
    data: { attempts },
  });
});
