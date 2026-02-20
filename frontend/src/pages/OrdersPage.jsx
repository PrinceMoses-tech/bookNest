import { useState, useEffect } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem('bookease-orders') || '[]'
    );
    setOrders(savedOrders.reverse());
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'status-processing';
      case 'Shipped':
        return 'status-shipped';
      case 'Delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1 className="page-title">My Orders</h1>
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h2>No orders yet</h2>
            <p>Your order history will appear here once you make a purchase.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order {order.id}</h3>
                  <p className="order-date">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.title} />
                    <div className="order-item-details">
                      <h4>{item.title}</h4>
                      <p>
                        {item.format} × {item.quantity}
                      </p>
                    </div>
                    <p className="order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <p className="order-total">Total: ${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

