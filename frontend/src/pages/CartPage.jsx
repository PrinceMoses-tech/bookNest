import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, calculateTotal, clearCart } =
    useCart();

  const total = calculateTotal();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const order = {
      id: orderId,
      items: cart,
      total: total,
      date: new Date().toISOString(),
      status: 'Processing',
    };

    const orders = JSON.parse(localStorage.getItem('bookease-orders') || '[]');
    orders.push(order);
    localStorage.setItem('bookease-orders', JSON.stringify(orders));

    clearCart();
    navigate(`/confirmation?orderId=${orderId}&total=${total.toFixed(2)}`);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>
          <div className="empty-cart">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Start adding some books to your cart!</p>
            <button className="btn btn-primary" onClick={() => navigate('/browse')}>
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={`${item.id}-${item.format}-${index}`} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p className="cart-item-author">{item.author}</p>
                <p className="cart-item-format">Format: {item.format}</p>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.format, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.id, item.format, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => removeFromCart(item.id, item.format)}
                >
                  Remove
                </button>
              </div>
              <div className="cart-item-total">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total-row">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-large" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

