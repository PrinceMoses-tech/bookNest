import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { books } from '../data/books';
import { useCart } from '../context/CartContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [format, setFormat] = useState('Paperback');

  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Book not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/browse')}>
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(book, quantity, format);
    alert(`${quantity} ${format} copy/copies of "${book.title}" added to cart!`);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="book-details-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="book-details">
          <div className="book-details-image">
            <img src={book.image} alt={book.title} />
          </div>

          <div className="book-details-content">
            <h1 className="book-details-title">{book.title}</h1>
            <p className="book-details-author">by {book.author}</p>
            <p className="book-details-genre">{book.genre}</p>
            <p className="book-details-price">${book.price.toFixed(2)}</p>

            <div className="book-details-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>

            <div className="book-details-options">
              <div className="option-group">
                <label htmlFor="format-select">Format:</label>
                <select
                  id="format-select"
                  className="format-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="Hardcover">Hardcover</option>
                  <option value="Paperback">Paperback</option>
                  <option value="E-book">E-book</option>
                </select>
              </div>

              <div className="option-group">
                <label htmlFor="quantity-select">Quantity:</label>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <input
                    id="quantity-select"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-large" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

