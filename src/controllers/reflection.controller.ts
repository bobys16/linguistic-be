import { Request, Response } from 'express';
import { ReflectionService } from '../services/reflection.service';
import { createReflectionSchema } from '../validators/reflection.validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';

const reflectionService = new ReflectionService();

export const createReflection = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  const data = createReflectionSchema.parse(req.body);
  
  const reflection = await reflectionService.createReflection(userId, data);

  res.status(201).json({
    status: 'success',
    data: { reflection },
  });
});

export const getMyReflections = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
  const tags = req.query.tags ? (req.query.tags as string).split(',') : undefined;
  
  const result = await reflectionService.getUserReflections(userId, {
    limit,
    offset,
    tags,
  });

  res.json({
    status: 'success',
    data: result,
  });
});

export const updateReflection = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  const { id } = req.params;
  const data = createReflectionSchema.partial().parse(req.body);
  
  const reflection = await reflectionService.updateReflection(id, userId, data);

  res.json({
    status: 'success',
    data: { reflection },
  });
});

export const deleteReflection = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  const { id } = req.params;
  
  const result = await reflectionService.deleteReflection(id, userId);

  res.json({
    status: 'success',
    data: result,
  });
});
