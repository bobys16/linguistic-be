import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const result = await authService.register(data);

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data);

  res.json({
    status: 'success',
    data: result,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as AuthRequest).user!;
  const user = await authService.getProfile(userId);

  res.json({
    status: 'success',
    data: { user },
  });
});
