import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, calculateTotal, clearCart } = useCart();
  const total = calculateTotal();

  const handleRemove = (id, format, title) => {
    removeFromCart(id, format);
    toast(`"${title}" removed from cart`, { icon: '🗑️' });
  };

  const handleCheckout = () => {
    const orderId = `ORD-${Date.now()}`;
    const order   = { id: orderId, items: cart, total, date: new Date().toISOString(), status: 'Processing' };
    const orders  = JSON.parse(localStorage.getItem('bookease-orders') || '[]');
    orders.push(order);
    localStorage.setItem('bookease-orders', JSON.stringify(orders));
    clearCart();
    navigate(`/confirmation?orderId=${orderId}&total=${total.toFixed(2)}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-950/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="text-indigo-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Looks like you haven't added any books yet.</p>
          <Link to="/browse">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/25"
            >
              Browse Books
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Shopping Cart</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${item.format}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                  className="flex gap-4 p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm"
                >
                  {/* Cover */}
                  <div className="w-16 h-24 sm:w-20 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug truncate">{item.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.author}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleRemove(item.id, item.format, item.title)}
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                        aria-label="Remove"
                      >
                        <FiTrash2 size={15} />
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 rounded-full">
                        {item.format}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
                        <FiTag size={11} /> ${item.price.toFixed(2)} each
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty control */}
                      <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.format, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.format, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm sticky top-24"
            >
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between font-bold text-slate-900 dark:text-slate-100 text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
              >
                Proceed to Checkout
              </motion.button>
              <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">Secure checkout · Free returns</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
