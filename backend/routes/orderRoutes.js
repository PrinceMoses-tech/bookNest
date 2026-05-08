import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByOrderId,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, adminOnly, getOrders);
router.route('/orderId/:orderId').get(protect, getOrderByOrderId);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, adminOnly, updateOrderStatus);

export default router;
