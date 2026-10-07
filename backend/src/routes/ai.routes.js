import { Router } from 'express';
import aiController from '../controllers/ai.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Allow optional auth so both guest sessions and logged-in users can use AI chat
router.use(optionalAuth);

router.post('/chat', aiLimiter, aiController.chat);
router.post('/ask', aiLimiter, aiController.chat);

export default router;
