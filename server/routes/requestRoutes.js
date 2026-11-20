import express from 'express';
import {
  createRequest,
  getMyIncomingRequests,
  getMyOutgoingRequests,
  respondToRequest,
  confirmReceipt,
  cancelRequest
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected NGO Claim Submission & History
router.post('/', protect, authorize('ngo', 'admin'), createRequest);
router.get('/outgoing', protect, authorize('ngo', 'admin'), getMyOutgoingRequests);
router.patch('/:id/confirm', protect, authorize('ngo', 'admin'), confirmReceipt);
router.delete('/:id/cancel', protect, authorize('ngo', 'admin'), cancelRequest);

// Protected Provider Response Endpoints
router.get('/incoming', protect, authorize('provider', 'admin'), getMyIncomingRequests);
router.patch('/:id/respond', protect, authorize('provider', 'admin'), respondToRequest);

export default router;
