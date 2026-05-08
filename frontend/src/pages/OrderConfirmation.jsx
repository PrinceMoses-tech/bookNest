import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiHome, FiArrowRight } from 'react-icons/fi';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';
  const total   = searchParams.get('total')   || '0.00';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md text-center"
      >
        {/* Animated check icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 16 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30"
        >
          <FiCheckCircle className="text-white" size={44} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2"
        >
          Order Placed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-slate-500 dark:text-slate-400 text-sm mb-8"
        >
          Thank you for your purchase. We'll send a confirmation email shortly.
        </motion.p>

        {/* Order details card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-8 text-left space-y-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Order ID</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">{orderId}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
            <span className="text-slate-500 dark:text-slate-400">Total Paid</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-base">${total}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
            <span className="text-slate-500 dark:text-slate-400">Status</span>
            <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">Processing</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
            <span className="text-slate-500 dark:text-slate-400">Shipping</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">Free · 3–5 days</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link to="/orders" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-200 text-sm"
            >
              <FiPackage size={16} /> Track Order
            </motion.button>
          </Link>
          <Link to="/" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 text-sm"
            >
              <FiHome size={16} /> Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
