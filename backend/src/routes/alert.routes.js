import { Router } from 'express';
import alertController from '../controllers/alert.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all alert routes with JWT authentication
router.use(requireAuth);

router.get('/', alertController.list);
router.patch('/read-all', alertController.markAllRead);
router.patch('/:id/read', alertController.markRead);
router.delete('/:id', alertController.delete);

export default router;
