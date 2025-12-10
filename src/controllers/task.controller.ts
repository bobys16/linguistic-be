import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { asyncHandler } from '../utils/asyncHandler';

const taskService = new TaskService();

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await taskService.getTaskById(id);

  res.json({
    status: 'success',
    data: { task },
  });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body);

  res.status(201).json({
    status: 'success',
    data: { task },
  });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await taskService.updateTask(id, req.body);

  res.json({
    status: 'success',
    data: { task },
  });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await taskService.deleteTask(id);

  res.json({
    status: 'success',
    data: result,
  });
});
