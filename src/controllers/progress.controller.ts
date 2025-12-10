import { Request, Response } from 'express';
import { ProgressService } from '../services/progress.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';

const progressService = new ProgressService();

export const getMyProgress = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  
  const progress = await progressService.getUserProgress(userId);

  res.json({
    status: 'success',
    data: { progress },
  });
});

export const getModuleProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = (req as AuthRequest).user!;
  const { moduleId } = req.params;
  
  const progress = await progressService.getModuleProgress(userId, moduleId);

  if (!progress) {
    res.status(404).json({
      status: 'error',
      message: 'Module not found',
    });
    return;
  }

  res.json({
    status: 'success',
    data: { progress },
  });
});
