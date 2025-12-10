import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createAttempt,
  getLatestAttempts,
  getAttemptSummary,
  getAttemptsByTask,
} from '../controllers/attempt.controller';

const router = Router();

router.post('/', authenticate, createAttempt);
router.get('/my-latest', authenticate, getLatestAttempts);
router.get('/my-summary', authenticate, getAttemptSummary);
router.get('/task/:taskId', authenticate, getAttemptsByTask);

export default router;
