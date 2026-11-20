import express from 'express';
import { getNgoRecommendations, evaluateArbitraryMatch } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected NGO Recommendations
router.get('/recommendations', protect, authorize('ngo', 'admin'), getNgoRecommendations);

// Public Benchmark Evaluator
router.post('/evaluate', evaluateArbitraryMatch);

export default router;
