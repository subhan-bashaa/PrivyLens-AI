import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

router.get('/settings', userController.getSettings);
router.put('/settings', userController.updateSettings);

router.get('/stats', userController.getStats);

export default router;
