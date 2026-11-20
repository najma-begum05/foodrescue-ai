import express from 'express';
import { 
  getShipments, 
  getShipmentById, 
  updateShipmentStatus, 
  optimizeMultiStopRoute 
} from '../controllers/logisticsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all assigned shipments
router.get('/shipments', getShipments);

// GET single shipment
router.get('/shipments/:id', getShipmentById);

// PATCH update status
router.patch('/shipments/:id/status', updateShipmentStatus);

// POST multi-stop route optimization
router.post('/optimize-route', optimizeMultiStopRoute);

export default router;
