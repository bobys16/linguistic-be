import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMyProgress, getModuleProgress } from '../controllers/progress.controller';

const router = Router();

router.get('/my', authenticate, getMyProgress);
router.get('/module/:moduleId', authenticate, getModuleProgress);

export default router;
