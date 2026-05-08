import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiMinus, FiPlus, FiStar } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import { books } from '../data/books';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BookCard from '../components/BookCard';
import toast from 'react-hot-toast';

const FORMATS = ['Paperback', 'Hardcover', 'E-book'];

export default function BookDetails() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { addToCart }            = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [format, setFormat]     = useState('Paperback');

  const book     = books.find(b => b.id === parseInt(id));
  const related  = books.filter(b => b.id !== book?.id && b.genre === book?.genre).slice(0, 4);
  const wishlisted = book ? isWishlisted(book.id) : false;

  if (!book) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-6xl mb-4">📚</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Book not found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">This book doesn't seem to exist.</p>
          <button onClick={() => navigate('/browse')} className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors">
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(book, quantity, format);
    toast.success(`Added ${quantity} × "${book.title}" to cart!`);
  };

  const handleWishlist = () => {
    toggle(book);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', { icon: wishlisted ? '💔' : '❤️' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group"
        >
          <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center md:justify-start"
          >
            <div className="relative w-full max-w-xs">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/15">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              </div>
              {/* Ambient glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-indigo-600/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-900/60 mb-4 w-fit">
              {book.genre}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
              {book.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base mb-4">by <span className="font-medium text-slate-700 dark:text-slate-300">{book.author}</span></p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} size={16} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
                ))}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">4.0 · 128 reviews</span>
            </div>

            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
              ${book.price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
              {book.description}
            </p>

            {/* Format selector */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">Format</p>
              <div className="flex gap-2 flex-wrap">
                {FORMATS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      format === f
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mb-7">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">Quantity</p>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-slate-100">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
              >
                <FiShoppingCart size={18} />
                Add to Cart · ${(book.price * quantity).toFixed(2)}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                  wishlisted
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-300 hover:text-rose-500 dark:hover:border-rose-800'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {wishlisted ? <HiHeart size={20} /> : <FiHeart size={20} />}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Related books */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">More in {book.genre}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
