import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from '../controllers/module.controller';

const router = Router();

// Public routes
router.get('/', authenticate, getAllModules);
router.get('/:id', authenticate, getModuleById);

// Admin routes (for now, just authenticated - can add admin middleware later)
router.post('/', authenticate, createModule);
router.patch('/:id', authenticate, updateModule);
router.delete('/:id', authenticate, deleteModule);

export default router;
