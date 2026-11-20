import express from 'express';
import { 
  getNgoRecommendations, 
  evaluateArbitraryMatch, 
  predictUrgency, 
  forecastSurplus 
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected NGO Recommendations
router.get('/recommendations', protect, authorize('ngo', 'admin'), getNgoRecommendations);

// Public AI Evaluators & Demonstration Forecasting
router.post('/evaluate', evaluateArbitraryMatch);
router.post('/predict-urgency', predictUrgency);
router.post('/forecast-surplus', forecastSurplus);

export default router;
