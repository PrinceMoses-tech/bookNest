import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiUsers, FiPackage, FiDollarSign, FiLoader, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TABS   = ['overview', 'users', 'orders'];
const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  Processing: 'bg-amber-100  dark:bg-amber-950/40  text-amber-700  dark:text-amber-400',
  Shipped:    'bg-sky-100    dark:bg-sky-950/40    text-sky-700    dark:text-sky-400',
  Delivered:  'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  Cancelled:  'bg-red-100    dark:bg-red-950/40    text-red-700    dark:text-red-400',
};

const cardBg = 'bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm';

export default function AdminPage() {
  const { token }       = useAuth();
  const [tab, setTab]   = useState('overview');
  const [users, setUsers]   = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [updating, setUpdating] = useState({});

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [uRes, oRes] = await Promise.all([
        api.get('/users',  token),
        api.get('/orders', token),
      ]);
      setUsers(uRes.data);
      setOrders(oRes.data);
    } catch (e) {
      setError(e.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const updateStatus = async (orderId, status) => {
    setUpdating(u => ({ ...u, [orderId]: true }));
    try {
      await api.put(`/orders/${orderId}/status`, { status }, token);
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status } : o)));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(u => ({ ...u, [orderId]: false }));
    }
  };

  const stats = {
    users:      users.length,
    orders:     orders.length,
    revenue:    orders.reduce((s, o) => s + (o.total || 0), 0),
    processing: orders.filter(o => o.status === 'Processing').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-3" size={32} />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading admin data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
        <div className={`${cardBg} p-8 max-w-md w-full text-center`}>
          <FiAlertCircle className="text-red-500 mx-auto mb-3" size={36} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Error loading data</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={fetchData} className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            <FiRefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-indigo-200 text-sm mt-1">Manage users, orders, and platform data</p>
            </div>
            <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white/15 text-white text-sm font-medium rounded-xl border border-white/20 hover:bg-white/25 transition-colors">
              <FiRefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FiUsers,      label: 'Total Users',   value: stats.users,                    color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40'  },
            { icon: FiPackage,    label: 'Total Orders',  value: stats.orders,                   color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40'  },
            { icon: FiDollarSign, label: 'Revenue',       value: `$${stats.revenue.toFixed(2)}`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
            { icon: FiLoader,     label: 'Processing',    value: stats.processing,               color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/40'    },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`${cardBg} p-5 flex items-center gap-4`}
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-slate-800">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                tab === t
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={cardBg}>
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Recent Orders</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.slice(0, 5).map(o => (
                  <div key={o._id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-slate-500 truncate">{o._id}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status] || STATUS_COLORS.Processing}`}>{o.status || 'Processing'}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">${Number(o.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="px-5 py-6 text-sm text-slate-400 text-center">No orders yet</p>}
              </div>
            </div>
            <div className={cardBg}>
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Recent Users</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.slice(0, 5).map(u => (
                  <div key={u._id} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                      {u.role || 'user'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className={cardBg}>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{users.length} Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30">
                    {['#','Name','Email','Role','Address','Joined'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u, i) => (
                    <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${u.role === 'admin' ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[160px] truncate">{u.address || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className={cardBg}>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{orders.length} Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30">
                    {['#','Order ID','Customer','Items','Total','Status','Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((o, i) => (
                    <tr key={o._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500 max-w-[140px] truncate">{o._id}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{o.user?.name || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-center">{o.items?.length ?? 0}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">${Number(o.total).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status || 'Processing'}
                          disabled={updating[o._id]}
                          onChange={e => updateStatus(o._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[o.status] || STATUS_COLORS.Processing} ${updating[o._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
