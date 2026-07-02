import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";
import { getCart, updateCartQuantity, removeFromCart } from "../services/api";

function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const user_id = localStorage.getItem("user_id");

  // Fetch cart items when component loads
  useEffect(() => {
    if (!user_id) {
      alert("Please login first");
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      const response = await getCart(user_id);
      if (response.success) {
        setCartItems(response.data);
      } else {
        alert("Failed to load cart");
      }
      setLoading(false);
    };

    fetchCart();
  }, [user_id]);

  // Calculate total price whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  // Handle quantity update or delete
  const handleUpdateQuantity = async (product_id, newQuantity) => {
    if (newQuantity <= 0) {
      // Delete item if quantity is 0
      const response = await updateCartQuantity(
        user_id,
        product_id,
        newQuantity
      );
      if (response.success) {
        setCartItems(
          cartItems.filter((item) => item.product_id !== product_id)
        );
      } else {
        alert("Failed to remove item");
      }
      return;
    }

    // Update quantity
    const response = await updateCartQuantity(user_id, product_id, newQuantity);
    if (response.success) {
      setCartItems(
        cartItems.map((item) =>
          item.product_id === product_id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      alert("Failed to update quantity");
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (product_id) => {
    const response = await removeFromCart(user_id, product_id);
    if (response.success) {
      setCartItems(cartItems.filter((item) => item.product_id !== product_id));
    } else {
      alert("Failed to remove item");
    }
  };

  // Navigate to checkout page
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }
    navigate("/checkout");
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading your cart...</p>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="/">Continue shopping</a>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="wrap">
      <h2 className="page-title">
        Your cart <span className="item-count">({cartItems.length} items)</span>
      </h2>

      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.product_id} className="item-card">
            <img src={item.image} alt={item.name} className="item-thumb" />

            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-meta">
                ₹{item.price.toLocaleString("en-IN")} each
              </p>
            </div>

            <div className="item-right">
              {/* Quantity stepper */}
              <div className="seg-stepper">
                <button
                  className="seg-btn"
                  onClick={() =>
                    handleUpdateQuantity(item.product_id, item.quantity - 1)
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="seg-val">{item.quantity}</div>
                <button
                  className="seg-btn"
                  onClick={() =>
                    handleUpdateQuantity(item.product_id, item.quantity + 1)
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Item total price */}
              <p className="item-price">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>

              {/* Remove button */}
              <button
                className="remove-btn"
                onClick={() => handleRemoveItem(item.product_id)}
                aria-label="Remove item"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart summary */}
      <div className="summary-card">
        <div className="sum-row">
          <span>Subtotal</span>
          <span>₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>
        <div className="sum-row">
          <span>Shipping</span>
          <span className="free-shipping">Free</span>
        </div>
        <div className="sum-row total">
          <span>Total</span>
          <span>₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          🔒 Proceed to checkout
        </button>
        <p className="secure-note">🛡 SSL secured · 30-day returns</p>
      </div>
    </div>
  );
}

export default CartPage;