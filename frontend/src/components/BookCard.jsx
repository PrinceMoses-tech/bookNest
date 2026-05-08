import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function BookCard({ book }) {
  const { toggle, isWishlisted } = useWishlist();
  const { addToCart }            = useCart();
  const wishlisted               = isWishlisted(book.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(book);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: wishlisted ? '💔' : '❤️',
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1, 'Paperback');
    toast.success(`"${book.title}" added to cart!`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-shadow duration-300 flex flex-col"
    >
      {/* Cover image */}
      <Link to={`/book/${book.id}`} className="relative block overflow-hidden">
        <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Genre badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-900/60">
          {book.genre}
        </span>

        {/* Wishlist button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-200"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted
            ? <HiHeart className="text-rose-500" size={16} />
            : <FiHeart className="text-slate-400 hover:text-rose-500 transition-colors" size={16} />
          }
        </motion.button>

        {/* Add to cart – slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-violet-700 active:scale-95 transition-colors"
          >
            <FiShoppingCart size={15} />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{book.author}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            ${book.price.toFixed(2)}
          </span>
          {/* Static stars */}
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
