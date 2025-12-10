import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createReflection,
  getMyReflections,
  updateReflection,
  deleteReflection,
} from '../controllers/reflection.controller';

const router = Router();

router.post('/', authenticate, createReflection);
router.get('/my', authenticate, getMyReflections);
router.patch('/:id', authenticate, updateReflection);
router.delete('/:id', authenticate, deleteReflection);

export default router;
