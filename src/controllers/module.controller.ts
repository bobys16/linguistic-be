import { Request, Response } from 'express';
import { ModuleService } from '../services/module.service';
import { asyncHandler } from '../utils/asyncHandler';

const moduleService = new ModuleService();

export const getAllModules = asyncHandler(async (_req: Request, res: Response) => {
  const modules = await moduleService.getAllModules();

  res.json({
    status: 'success',
    data: { modules },
  });
});

export const getModuleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const module = await moduleService.getModuleById(id);

  res.json({
    status: 'success',
    data: { module },
  });
});

export const createModule = asyncHandler(async (req: Request, res: Response) => {
  const module = await moduleService.createModule(req.body);

  res.status(201).json({
    status: 'success',
    data: { module },
  });
});

export const updateModule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const module = await moduleService.updateModule(id, req.body);

  res.json({
    status: 'success',
    data: { module },
  });
});

export const deleteModule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await moduleService.deleteModule(id);

  res.json({
    status: 'success',
    data: result,
  });
});
