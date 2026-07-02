import '../styles/ProductCard.css';
import { Link } from 'react-router-dom';  // ← ADD THIS IMPORT
import { addToCart } from '../services/api';

function ProductCard({ product }) {
  const handleAddToCart = async () => {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      alert('Please login first');
      return;
    }

    const response = await addToCart(user_id, product.id, 1);

    if (response.success)  {
      alert('Added to cart!');
    } else {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="product-card">
      {/* Link to product details */}
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-card-image-wrap">
          <img src={product.image} alt={product.name} />
          {product.tag && (
            <span className={`product-tag ${product.tag.toLowerCase()}`}>
              {product.tag}
            </span>
          )}
        </div>

        <div className="product-card-body">
          <h3>{product.name}</h3>
          <p>{product.description}</p>

          <div className="product-card-footer">
            <div className="price-row">
              <span className="price">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="price-original">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="price-badge">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % off
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to cart button outside link */}
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        + Add to cart
      </button>
    </div>
  );
}

export default ProductCard;


