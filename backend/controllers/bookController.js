import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req, res) => {
  const { genre } = req.query;
  
  const filter = genre && genre !== 'All' ? { genre } : {};
  
  const books = await Book.find(filter).sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: books.length,
    data: books,
  });
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.json({
    success: true,
    data: book,
  });
});

// @desc    Create book
// @route   POST /api/books
// @access  Public (should be Admin in production)
export const createBook = asyncHandler(async (req, res) => {
  const { title, author, genre, description, price, image, stock } = req.body;

  const book = await Book.create({
    title,
    author,
    genre,
    description,
    price,
    image,
    stock: stock || 100,
  });

  res.status(201).json({
    success: true,
    data: book,
  });
});

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Public (should be Admin in production)
export const updateBook = asyncHandler(async (req, res) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: book,
  });
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public (should be Admin in production)
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  await book.deleteOne();

  res.json({
    success: true,
    message: 'Book removed',
  });
});

// @desc    Get genres
// @route   GET /api/books/genres/list
// @access  Public
export const getGenres = asyncHandler(async (req, res) => {
  const genres = await Book.distinct('genre');
  
  res.json({
    success: true,
    data: genres,
  });
});

