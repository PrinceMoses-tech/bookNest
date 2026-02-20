import { Link } from 'react-router-dom';
import { books } from '../data/books';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const featuredBooks = books.slice(0, 3);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Book</h1>
          <p className="hero-subtitle">
            Explore our curated collection of timeless classics and modern
            masterpieces. Find your perfect read today.
          </p>
          <Link to="/browse" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Books</h2>
          <div className="books-grid">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

