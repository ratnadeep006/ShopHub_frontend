import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/OrdersPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/order/${user_id}`
        );
        const data = await response.json();
        console.log('Orders Response:', data);

        if (data.success) {
          setOrders(data.data || []);
        } else {
          toast.error(data.message || 'Failed to load orders');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Network error');
      }
      setLoading(false);
    };

    if (user_id) {
      fetchOrders();
    } else {
      toast.error('Please login first');
      navigate('/login');
    }
  }, [user_id, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-orders">
          <h2>⏳ Loading your orders...</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <h2>Your Orders</h2>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>📦 No orders yet!</h2>
            <p>You haven't placed any orders yet</p>
            <button onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">

                {/* Order Header */}
                <div className="order-header">
                  <div className="order-id">
                    <p className="label">Order ID</p>
                    <p className="value">#{order.id}</p>
                  </div>

                  <div className="order-date">
                    <p className="label">Date</p>
                    <p className="value">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="order-total">
                    <p className="label">Total</p>
                    <p className="value">₹{order.total_price}</p>
                  </div>

                  <div className="order-status">
                    <p className="label">Status</p>
                    <p className={`status ${order.status}`}>
                      {order.status?.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="order-actions">
                  <button className="view-details-btn">
                    View Details →
                  </button>
                  {order.status === 'delivered' && (
                    <button className="return-btn">
                      🔄 Request Return
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OrdersPage;