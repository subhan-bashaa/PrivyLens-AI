import { Router } from 'express';
import reportController from '../controllers/report.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Allow optional auth for report routes
router.use(optionalAuth);

router.post('/:policyId', reportController.generate);
router.get('/', reportController.list);
router.get('/:id', reportController.getById);

export default router;
