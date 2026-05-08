import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const ensureDatabaseConnected = () => {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error('Database unavailable. Please try again shortly.');
    error.statusCode = 503;
    throw error;
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  ensureDatabaseConnected();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  ensureDatabaseConnected();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
  });
});

// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  ensureDatabaseConnected();
  const user = await User.findById(req.user.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
  });
});


