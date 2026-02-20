import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByOrderId,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(createOrder).get(getOrders);
router.route('/orderId/:orderId').get(getOrderByOrderId);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(updateOrderStatus);

export default router;

