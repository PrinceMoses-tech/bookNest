import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Book from '../models/Book.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = asyncHandler(async (req, res) => {
  const { items, userId, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Order items are required');
  }

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Generate order ID
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Verify books exist and update stock
  for (const item of items) {
    if (item.book) {
      const book = await Book.findById(item.book);
      if (!book) {
        res.status(404);
        throw new Error(`Book with ID ${item.book} not found`);
      }
      if (book.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${book.title}`);
      }
      // Update stock
      book.stock -= item.quantity;
      await book.save();
    }
  }

  const order = await Order.create({
    orderId,
    userId: userId || 'guest',
    items,
    total,
    shippingAddress: shippingAddress || {},
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
export const getOrders = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  
  const filter = userId ? { userId } : {};
  
  const orders = await Order.find(filter)
    .populate('items.book', 'title author image')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'items.book',
    'title author image'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    success: true,
    data: order,
  });
});

// @desc    Get order by orderId
// @route   GET /api/orders/orderId/:orderId
// @access  Public
export const getOrderByOrderId = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId }).populate(
    'items.book',
    'title author image'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    success: true,
    data: order,
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public (should be Admin in production)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  res.json({
    success: true,
    data: order,
  });
});

