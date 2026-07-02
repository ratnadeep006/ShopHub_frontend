import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetailsPage.css';
import { getProductById, addToCart } from '../services/api';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const user_id = localStorage.getItem('user_id');

  // Fetch product details
useEffect(() => {
  const fetchProduct = async () => {
    setLoading(true);
    const response = await getProductById(id);
    if (response.success) {
      setProduct(response.data);
    } else {
      alert('Product not found');
      navigate('/');
    }
    setLoading(false);
  };

  fetchProduct();
}, [id, navigate]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!user_id) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (quantity < 1) {
      alert('Please select a valid quantity');
      return;
    }

    setAdding(true);
    const response = await addToCart(user_id, product.id, quantity);

    if (response.success) {
      alert('Added to cart successfully!');
      setQuantity(1);
    } else {
      alert('Failed to add to cart: ' + response.message);
    }
    setAdding(false);
  };

  // Handle quantity change
  const handleQuantityChange = (value) => {
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  if (loading) {
    return <h2>Loading product details...</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div className="product-details-container">
      
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Products
      </button>

      <div className="product-details-content">
        
        {/* Product Image */}
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          
          <h1 className="product-name">{product.name}</h1>

          <div className="product-rating">
            <span className="stars">⭐⭐⭐⭐⭐</span>
            <span className="reviews">(120 reviews)</span>
          </div>

          <div className="product-price-section">
            <h2 className="product-price">₹{product.price.toLocaleString('en-IN')}</h2>
            <span className="discount">15% OFF</span>
          </div>

          <p className="product-description">
            {product.description}
          </p>

          {/* Stock Info */}
          <div className="stock-info">
            {product.stock > 0 ? (
              <p className="in-stock">✓ In Stock ({product.stock} available)</p>
            ) : (
              <p className="out-of-stock">✗ Out of Stock</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-selector">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                min="1"
                max={product.stock}
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="total-price">
            <p>Total: <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span></p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={adding || product.stock <= 0}
            >
              {adding ? 'Adding...' : '🛒 Add to Cart'}
            </button>
            <button className="buy-now-btn">
              💳 Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="product-features">
            <h3>Key Features:</h3>
            <ul>
              <li>✓ Free Shipping</li>
              <li>✓ 30-day Returns</li>
              <li>✓ 1 Year Warranty</li>
              <li>✓ Secure Checkout</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Additional Info */}
      <div className="additional-info">
        <div className="info-card">
          <h3>Specifications</h3>
          <p><strong>Product ID:</strong> {product.id}</p>
          <p><strong>Category:</strong> Category {product.category_id}</p>
          <p><strong>In Stock:</strong> {product.stock} units</p>
        </div>

        <div className="info-card">
          <h3>Shipping Info</h3>
          <p>📍 Ships within 2-3 business days</p>
          <p>🚚 Free delivery on orders above ₹500</p>
          <p>↩️ Easy returns within 30 days</p>
        </div>
      </div>

    </div>
  );
}

export default ProductDetailsPage;