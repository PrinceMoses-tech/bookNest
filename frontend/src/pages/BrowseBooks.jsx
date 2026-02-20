import { useState } from 'react';
import { books } from '../data/books';
import BookCard from '../components/BookCard';
import { useCart } from '../context/CartContext';

const BrowseBooks = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const { addToCart } = useCart();

  const genres = ['All', ...new Set(books.map((book) => book.genre))];

  const filteredBooks =
    selectedGenre === 'All'
      ? books
      : books.filter((book) => book.genre === selectedGenre);

  const handleAddToCart = (book) => {
    addToCart(book, 1, 'Paperback');
    alert(`${book.title} added to cart!`);
  };

  return (
    <div className="browse-page">
      <div className="container">
        <h1 className="page-title">Browse Books</h1>

        <div className="filter-section">
          <label htmlFor="genre-filter" className="filter-label">
            Filter by Genre:
          </label>
          <select
            id="genre-filter"
            className="filter-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card-wrapper">
              <BookCard book={book} />
              <button
                className="btn btn-secondary btn-small"
                onClick={() => handleAddToCart(book)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="empty-state">
            <p>No books found in this genre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;

