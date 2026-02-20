import { useNavigate, useSearchParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';
  const total = searchParams.get('total') || '0.00';

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-content">
          <div className="confirmation-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="confirmation-title">
            Your Order Has Been Placed Successfully!
          </h1>

          <div className="confirmation-details">
            <div className="confirmation-detail-item">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{orderId}</span>
            </div>
            <div className="confirmation-detail-item">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value">${total}</span>
            </div>
          </div>

          <p className="confirmation-message">
            Thank you for your purchase! You will receive a confirmation email
            shortly. You can track your order in the Orders page.
          </p>

          <div className="confirmation-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

