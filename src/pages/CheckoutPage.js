import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';
import { getCart, createOrder } from '../services/api';

function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const user_id = localStorage.getItem('user_id');

useEffect(() => {
  if (!user_id) {
    alert('Please login first');
    return;
  }

  const fetchCart = async () => {
    setLoading(true);
    const response = await getCart(user_id);
    if (response.success) {
      setCartItems(response.data);
    } else {
      alert('Failed to load cart');
    }
    setLoading(false);
  };

  fetchCart();
}, [user_id]);  // ✅ Only user_id as dependency

  // Calculate total
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);



  // Place order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    setPlacing(true);

    const response = await createOrder(user_id);

    if (response.success) {
      alert('Order placed successfully! Order ID: ' + response.order_id);
      
      // Clear cart and redirect to orders page
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } else {
      alert('Failed to place order: ' + response.message);
    }

    setPlacing(false);
  };

  if (loading) {
    return <h2>Loading checkout...</h2>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <a href="/cart">Back to cart</a>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Order Review</h2>

      <div className="checkout-content">
        
        {/* Items Summary */}
        <div className="checkout-items">
          <h3>Items in your order:</h3>
          {cartItems.map(item => (
            <div key={item.product_id} className="checkout-item">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <p>{item.name}</p>
                <p>Qty: {item.quantity}</p>
              </div>
              <p className="item-price">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className="free">FREE</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>₹0</span>
          </div>

          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>

          <button 
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? 'Placing order...' : 'Place Order'}
          </button>

          <div className="checkout-footer">
            <p>✓ Secure checkout</p>
            <p>✓ Money-back guarantee</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;