import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get or create user
// @route   GET /api/users/:email
// @access  Public
export const getUserByEmail = asyncHandler(async (req, res) => {
  let user = await User.findOne({ email: req.params.email });

  if (!user) {
    // Create user if doesn't exist
    user = await User.create({
      email: req.params.email,
      name: req.params.email.split('@')[0],
      address: '',
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Public
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, address } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    address: address || '',
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public (should be Admin in production)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

