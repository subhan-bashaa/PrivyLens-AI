import { Router } from 'express';
import monitoringController from '../controllers/monitoring.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Require authentication for all monitoring routes
router.use(requireAuth);

router.post('/enable', monitoringController.enable);
router.post('/disable', monitoringController.disable);
router.get('/', monitoringController.list);
router.post('/:id/check', monitoringController.checkNow);

export default router;
