import { Router } from 'express';
import multer from 'multer';
import policyController from '../controllers/policy.controller.js';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import { validatePolicyAnalyze } from '../middleware/validation.middleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const router = Router();

// Allow optional auth so public and demo policies can be viewed and analyzed
router.use(optionalAuth);

router.post('/analyze', aiLimiter, validatePolicyAnalyze, policyController.analyze);
router.post('/upload-pdf', aiLimiter, upload.single('file'), policyController.uploadPdf);
router.get('/', policyController.list);
router.get('/lookup', policyController.lookup);
router.get('/:id', policyController.getById);
router.get('/:id/summary', policyController.getSummary);
router.get('/:id/details', policyController.getDetails);
router.get('/:id/versions', policyController.getVersions);
router.get('/:id/compare', policyController.compare);
router.delete('/:id', policyController.delete);

export default router;
