import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';

const router = Router();

router.get('/:id', authenticate, getTaskById);
router.post('/', authenticate, createTask);
router.patch('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

export default router;
