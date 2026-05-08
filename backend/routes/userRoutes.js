import express from 'express';
import {
  getUsers,
  getUserByEmail,
  createUser,
  updateUser,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, adminOnly, getUsers).post(createUser);
router.route('/:email').get(getUserByEmail);
router.route('/:id').put(protect, updateUser);

export default router;
