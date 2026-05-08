import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMapPin, FiShield, FiPackage, FiHeart, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  Processing: 'bg-amber-100  dark:bg-amber-950/40  text-amber-700  dark:text-amber-400',
  Shipped:    'bg-sky-100    dark:bg-sky-950/40    text-sky-700    dark:text-sky-400',
  Delivered:  'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  Cancelled:  'bg-red-100    dark:bg-red-950/40    text-red-700    dark:text-red-400',
};

export default function ProfilePage() {
  const { user, logout, token } = useAuth();
  const { wishlist, toggle }    = useWishlist();
  const navigate                = useNavigate();
  const [orders, setOrders]     = useState([]);
  const [tab, setTab]           = useState('orders');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user || !token) return;
    api.get(`/orders?userId=${user.id}`, token)
      .then(res => setOrders(res.data.slice(0, 10)))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, token]);

  const handleLogout = () => {
    logout();
    toast('Signed out. See you soon!', { icon: '👋' });
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-lg backdrop-blur-sm">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-indigo-200 text-sm mt-0.5">{user.email}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Account info card */}
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">Account Info</h2>
              <ul className="space-y-3">
                {[
                  { icon: FiUser,    label: 'Name',    value: user.name },
                  { icon: FiMail,    label: 'Email',   value: user.email },
                  { icon: FiShield,  label: 'Role',    value: user.role || 'user' },
                  ...(user.address ? [{ icon: FiMapPin, label: 'Address', value: user.address }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate capitalize">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleLogout}
                className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
              >
                <FiLogOut size={15} /> Sign out
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FiPackage, value: orders.length, label: 'Orders',      color: 'text-indigo-600 dark:text-indigo-400' },
                { icon: FiHeart,   value: wishlist.length, label: 'Wishlisted', color: 'text-rose-500'                        },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 shadow-sm text-center">
                  <Icon size={20} className={`${color} mx-auto mb-1`} />
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main panel */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl w-fit">
              {['orders', 'wishlist'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                    tab === t
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {t === 'orders' ? `Orders (${orders.length})` : `Wishlist (${wishlist.length})`}
                </button>
              ))}
            </div>

            {/* Orders tab */}
            {tab === 'orders' && (
              <div className="space-y-3">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 skeleton-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                  ))
                ) : orders.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-8 text-center">
                    <FiPackage className="text-slate-300 dark:text-slate-600 mx-auto mb-3" size={36} />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No orders yet</p>
                    <Link to="/browse" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                      Start shopping →
                    </Link>
                  </div>
                ) : (
                  orders.map(order => (
                    <motion.div
                      key={order.id || order._id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 shadow-sm flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                        <FiPackage size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {order.orderId || order.id}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(order.date || order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || STATUS_COLORS.Processing}`}>
                          {order.status || 'Processing'}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Wishlist tab */}
            {tab === 'wishlist' && (
              <div>
                {wishlist.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-8 text-center">
                    <FiHeart className="text-slate-300 dark:text-slate-600 mx-auto mb-3" size={36} />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your wishlist is empty</p>
                    <Link to="/browse" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                      Discover books →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map(book => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm"
                      >
                        <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Link to={`/book/${book.id}`} className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 leading-snug transition-colors">
                            {book.title}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">${book.price.toFixed(2)}</span>
                            <button
                              onClick={() => { toggle(book); toast(`Removed from wishlist`, { icon: '💔' }); }}
                              className="text-xs text-rose-500 hover:text-rose-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
