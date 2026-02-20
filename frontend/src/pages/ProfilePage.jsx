import { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [orders, setOrders] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedProfile = JSON.parse(
      localStorage.getItem('bookease-profile') || '{}'
    );
    setFormData({
      name: savedProfile.name || '',
      email: savedProfile.email || '',
      address: savedProfile.address || '',
    });

    const savedOrders = JSON.parse(
      localStorage.getItem('bookease-orders') || '[]'
    );
    setOrders(savedOrders.slice(0, 5).reverse());
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('bookease-profile', JSON.stringify(formData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">Profile</h1>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {isSaved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </form>
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
                  <div key={order.id} className="order-history-item">
                    <div>
                      <h4>{order.id}</h4>
                      <p className="order-history-date">
                        {new Date(order.date).toLocaleDateString()}
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

