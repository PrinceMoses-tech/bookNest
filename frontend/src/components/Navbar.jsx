import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiShoppingCart, FiHeart, FiSun, FiMoon,
  FiMenu, FiX, FiUser, FiLogOut, FiBook,
  FiChevronDown, FiPackage, FiSettings,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [query, setQuery]           = useState('');
  const [scrolled, setScrolled]     = useState(false);

  const { isDark, toggle }                    = useTheme();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { getCartItemCount }                  = useCart();
  const { wishlist }                          = useWishlist();
  const location  = useLocation();
  const navigate  = useNavigate();

  const cartCount     = getCartItemCount();
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => { if (!e.target.closest('[data-user-menu]')) setUserOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const isActive = (p) => location.pathname === p;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    navigate('/');
  };

  const navBase = `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200`;
  const navActive = `${navBase} text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60`;
  const navIdle  = `${navBase} text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60`;

  const iconBtn = `w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200`;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-slate-200/60 dark:border-slate-800/60'
          : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
            <FiBook className="text-white" size={16} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            BookNest
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/"       className={isActive('/')       ? navActive : navIdle}>Home</Link>
          <Link to="/browse" className={isActive('/browse') ? navActive : navIdle}>Browse</Link>
          {isAuthenticated && (
            <Link to="/orders" className={isActive('/orders') ? navActive : navIdle}>Orders</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`${navBase} text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/40`}>
              Admin
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">

          {/* Expandable search */}
          <div className="flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSearch}
                  className="hidden sm:flex overflow-hidden mr-1"
                >
                  <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search books…"
                    className="w-full px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-400"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button onClick={() => setSearchOpen(s => !s)} className={iconBtn} aria-label="Search">
              {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
            </button>
          </div>

          {/* Theme toggle */}
          <motion.button whileTap={{ rotate: 20, scale: 0.85 }} onClick={toggle} className={iconBtn} aria-label="Toggle theme">
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>

          {/* Wishlist */}
          {isAuthenticated && (
            <Link to="/profile" className={`${iconBtn} relative`} aria-label="Wishlist">
              <FiHeart size={18} />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className={`${iconBtn} relative`} aria-label="Cart">
            <FiShoppingCart size={18} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Auth: user menu or login/signup */}
          {isAuthenticated ? (
            <div className="relative hidden md:block" data-user-menu>
              <button
                onClick={() => setUserOpen(s => !s)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <FiChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${userOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1.5">
                      {[
                        { to: '/profile', icon: FiUser,     label: 'Profile' },
                        { to: '/orders',  icon: FiPackage,  label: 'My Orders' },
                      ].map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <Icon size={15} /> {label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
                          <FiSettings size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <FiLogOut size={15} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(s => !s)} className={`md:hidden ${iconBtn}`} aria-label="Menu">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={menuOpen ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden overflow-hidden border-t border-slate-100 dark:border-slate-800/50"
          >
            <form onSubmit={handleSearch} className="flex gap-2 px-4 py-3">
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search books…"
                className="flex-1 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-400"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl">
                Go
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-950"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {[
                { to: '/',       label: 'Home' },
                { to: '/browse', label: 'Browse Books' },
                ...(isAuthenticated ? [
                  { to: '/orders',  label: 'My Orders' },
                  { to: '/profile', label: 'Profile' },
                ] : []),
                ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : []),
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 w-full transition-all"
                  >
                    <FiLogOut size={15} /> Sign out
                  </button>
                ) : (
                  <div className="flex gap-3 pt-1">
                    <Link to="/login" className="flex-1 px-4 py-2.5 text-sm font-medium text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                      Login
                    </Link>
                    <Link to="/signup" className="flex-1 px-4 py-2.5 text-sm font-semibold text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
