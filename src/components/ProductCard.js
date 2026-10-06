import { useState, useEffect } from 'react';
import '../styles/ProductCard.css';
import { Link } from 'react-router-dom';
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from '../services/api';

function ProductCard({ product, onRemoveFromWishlist }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const user_id = localStorage.getItem('user_id');

  // Check if this product is already in the user's wishlist
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user_id) return;
      const response = await checkWishlist(user_id, product.id);
      if (response.success) {
        setInWishlist(response.inWishlist);
      }
    };
    fetchWishlistStatus();
  }, [user_id, product.id]);

  const handleAddToCart = async () => {
    console.log("button clicked");

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

  const handleToggleWishlist = async (e) => {
    // stop the click from bubbling into the <Link> that wraps the card
    e.preventDefault();
    e.stopPropagation();

    if (!user_id) {
      alert('Please login first');
      return;
    }

    setWishlistLoading(true);
    const response = inWishlist
      ? await removeFromWishlist(user_id, product.id)
      : await addToWishlist(user_id, product.id);

    if (response.success) {
      setInWishlist(!inWishlist);
      if (inWishlist && onRemoveFromWishlist) {
        onRemoveFromWishlist(product.id);
      }
      // Let the Navbar (and anything else listening) know the wishlist changed
      window.dispatchEvent(new Event("wishlistUpdated"));
    } else {
      alert(response.message || 'Something went wrong');
    }
    setWishlistLoading(false);
  };

  return (
    <div className="product-card">
      {/* Wishlist button - sits on top of the image, outside the Link */}
      <button
        className={`product-card-wishlist-btn ${inWishlist ? 'active' : ''}`}
        onClick={handleToggleWishlist}
        disabled={wishlistLoading}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {inWishlist ? '❤️' : '🤍'}
      </button>

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