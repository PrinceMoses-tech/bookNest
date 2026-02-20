import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getGenres,
} from '../controllers/bookController.js';

const router = express.Router();

router.route('/').get(getBooks).post(createBook);
router.route('/genres/list').get(getGenres);
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);

export default router;

