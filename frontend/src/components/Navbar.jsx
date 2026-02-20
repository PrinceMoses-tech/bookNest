import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const cartItemCount = getCartItemCount();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/browse', label: 'Browse Books' },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          BookEase
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={isActive(link.path) ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {isAuthenticated && (
            <>
              <li>
                <Link
                  to="/orders"
                  className={isActive('/orders') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={isActive('/profile') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              to="/cart"
              className={`cart-link ${isActive('/cart') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Cart
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          </li>

          {!isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/login"
                  className={isActive('/login') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className={isActive('/signup') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button className="btn btn-secondary btn-small" onClick={handleLogout}>
                {user?.name ? `Logout (${user.name})` : 'Logout'}
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

