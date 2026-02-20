import express from 'express';
import {
  getUsers,
  getUserByEmail,
  createUser,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getUsers).post(createUser);
router.route('/:email').get(getUserByEmail);
router.route('/:id').put(updateUser);

export default router;

