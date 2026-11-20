import express from 'express';
import {
  getAllListings,
  getMyListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  updateListingStatus
} from '../controllers/listingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Discovery Endpoints
router.get('/', getAllListings);
router.get('/:id', getListingById);

// Protected Provider Management Endpoints
router.get('/my/all', protect, authorize('provider', 'admin'), getMyListings);
router.post('/', protect, authorize('provider', 'admin'), createListing);
router.put('/:id', protect, authorize('provider', 'admin'), updateListing);
router.delete('/:id', protect, authorize('provider', 'admin'), deleteListing);
router.patch('/:id/status', protect, authorize('provider', 'admin'), updateListingStatus);

export default router;
