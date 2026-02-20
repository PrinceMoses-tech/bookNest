import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProfilePage = () => {
  const { user, logout, token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders?userId=${user.id}`, token);
        setOrders(res.data.slice(0, 5));
      } catch {
        setOrders([]);
      }
    };

    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">Profile</h1>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Account</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            {user.address && (
              <p>
                <strong>Address:</strong> {user.address}
              </p>
            )}
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>

          <div className="profile-section">
            <h2>Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="empty-state-small">
                <p>No recent orders</p>
              </div>
            ) : (
              <div className="order-history">
                {orders.map((order) => (
                  <div key={order.id || order._id} className="order-history-item">
                    <div>
                      <h4>{order.orderId || order.id}</h4>
                      <p className="order-history-date">
                        {new Date(order.date || order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-history-total">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

