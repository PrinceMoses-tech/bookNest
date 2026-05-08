import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Book from '../models/Book.js';
import createDB from '../config/db.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config();

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Fiction',
    description:
      'A classic American novel set in the Jazz Age, following Nick Carraway\'s encounters with the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Fiction',
    description:
      'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian Fiction',
    description:
      'A dystopian social science fiction novel about totalitarian surveillance and thought control in a future society.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description:
      'A romantic novel of manners that follows the character development of Elizabeth Bennet and her relationship with Mr. Darcy.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Coming of Age',
    description:
      'A controversial novel following Holden Caulfield\'s experiences in New York City after being expelled from prep school.',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: 'Lord of the Flies',
    author: 'William Golding',
    genre: 'Adventure',
    description:
      'A story about a group of British boys stranded on an uninhabited island and their disastrous attempt to govern themselves.',
    price: 11.49,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description:
      'A fantasy novel following the quest of home-loving Bilbo Baggins to win a share of treasure guarded by Smaug the dragon.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian Fiction',
    description:
      'A dystopian novel set in a futuristic World State where people are genetically bred and pharmaceutically conditioned.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Philosophical Fiction',
    description:
      'A philosophical novel about a young Andalusian shepherd who travels from Spain to Egypt in search of treasure.',
    price: 13.49,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    stock: 100,
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description:
      'The first novel in the Harry Potter series, following Harry\'s discovery of his magical heritage and his first year at Hogwarts.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    stock: 100,
  },
];

const seedBooks = async () => {
  try {
    await createDB();
    
    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert books
    await Book.insertMany(books);
    console.log(`✅ Seeded ${books.length} books successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();

