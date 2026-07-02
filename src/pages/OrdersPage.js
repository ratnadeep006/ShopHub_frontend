import { useState, useEffect } from 'react';
import '../styles/OrdersPage.css';
import { getUserOrders } from '../services/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user_id = localStorage.getItem('user_id');

  // Fetch user's orders
  useEffect(() => {
    if (!user_id) {
      alert('Please login first');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      const response = await getUserOrders(user_id);
      
      if (response.success) {
        setOrders(response.data);
      } else {
        alert('Failed to load orders');
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user_id]);

  if (loading) {
    return <h2>Loading your orders...</h2>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>No orders yet</h2>
        <p>You haven't placed any orders</p>
        <a href="/">Continue shopping</a>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

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
                  {order.status.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Order Details Button */}
            <button className="view-details-btn">
              View Details →
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;