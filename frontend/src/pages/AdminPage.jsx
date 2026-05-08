import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['overview', 'users', 'orders'];

const StatusBadge = ({ status }) => {
  const map = {
    Processing: 'status-processing',
    Shipped: 'status-shipped',
    Delivered: 'status-delivered',
    Cancelled: 'status-cancelled',
  };
  return (
    <span className={`order-status ${map[status] || 'status-processing'}`}>
      {status}
    </span>
  );
};

const AdminPage = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, ordersRes] = await Promise.all([
        api.get('/users', token),
        api.get('/orders', token),
      ]);
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus }, token);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Failed to update order status: ' + err.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="admin-loading">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="admin-error">
            <p>{error}</p>
            <button className="btn btn-primary btn-small" onClick={fetchData}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage your BookNest store</p>
          </div>
          <button className="btn btn-secondary btn-small" onClick={fetchData}>
            Refresh
          </button>
        </div>

        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-users">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="stat-body">
                  <p className="stat-label">Total Users</p>
                  <p className="stat-value">{users.length}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-orders">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <div className="stat-body">
                  <p className="stat-label">Total Orders</p>
                  <p className="stat-value">{orders.length}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-revenue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="stat-body">
                  <p className="stat-label">Total Revenue</p>
                  <p className="stat-value">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-processing">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="stat-body">
                  <p className="stat-label">Processing</p>
                  <p className="stat-value">{statusCounts.Processing || 0}</p>
                </div>
              </div>
            </div>

            <div className="overview-tables">
              <div className="overview-section">
                <h2 className="overview-section-title">Recent Orders</h2>
                {orders.length === 0 ? (
                  <p className="admin-empty">No orders yet.</p>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>User</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id}>
                            <td className="order-id-cell">{order.orderId || order._id}</td>
                            <td>{order.userId || '—'}</td>
                            <td>${(order.total || 0).toFixed(2)}</td>
                            <td><StatusBadge status={order.status} /></td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="overview-section">
                <h2 className="overview-section-title">Recent Users</h2>
                {users.length === 0 ? (
                  <p className="admin-empty">No users yet.</p>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 5).map((user) => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`role-badge role-${user.role}`}>
                                {user.role}
                              </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-meta">
              <h2>{users.length} registered user{users.length !== 1 ? 's' : ''}</h2>
            </div>
            {users.length === 0 ? (
              <p className="admin-empty">No users found.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Address</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr key={user._id}>
                        <td className="row-num">{i + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.address || <span className="muted">—</span>}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section">
            <div className="section-meta">
              <h2>{orders.length} order{orders.length !== 1 ? 's' : ''}</h2>
            </div>
            {orders.length === 0 ? (
              <p className="admin-empty">No orders found.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr key={order._id}>
                        <td className="row-num">{i + 1}</td>
                        <td className="order-id-cell">{order.orderId || order._id}</td>
                        <td>{order.userId || '—'}</td>
                        <td>{order.items?.length || 0}</td>
                        <td>${(order.total || 0).toFixed(2)}</td>
                        <td><StatusBadge status={order.status} /></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            disabled={updatingOrder === order._id}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                          >
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
