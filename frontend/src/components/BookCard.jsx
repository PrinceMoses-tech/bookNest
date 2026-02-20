import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <Link to={`/book/${book.id}`} className="book-card-link">
        <div className="book-card-image">
          <img src={book.image} alt={book.title} />
        </div>
        <div className="book-card-content">
          <h3 className="book-card-title">{book.title}</h3>
          <p className="book-card-author">{book.author}</p>
          <p className="book-card-genre">{book.genre}</p>
          <p className="book-card-price">${book.price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;

