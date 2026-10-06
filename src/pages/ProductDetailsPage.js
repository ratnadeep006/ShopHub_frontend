import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ProductDetailsPage.css";
import {
  getProductById,
  addToCart,
  getAllProducts,
  getProductReviews,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const user_id = localStorage.getItem("user_id");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const response = await getProductById(id);
      if (response.success) {
        setProduct(response.data);
        setWishlistCount(response.data.wishlist_count || 0);
      } else {
        toast.error("Product not found");
        navigate("/");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  // Set the browser tab title to the product name
  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | ShopHub`;
    }
    return () => {
      document.title = "ShopHub";
    };
  }, [product]);

  // Check if this product is already in the user's wishlist
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user_id || !id) return;
      const response = await checkWishlist(user_id, id);
      if (response.success) {
        setInWishlist(response.inWishlist);
      }
    };
    fetchWishlistStatus();
  }, [user_id, id]);

  // Fetch related products (same category)
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response.success) {
          const filtered = response.data.filter(
            (p) =>
              p.category_id === product?.category_id && p.id !== product?.id,
          );
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      const response = await getProductReviews(id);
      if (response.success) {
        setReviews(response.data || []);
      } else {
        toast.error("Couldn't load reviews right now");
      }
      setReviewsLoading(false);
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Get all product images (memoized so it's not rebuilt on every render)
  const productImages = useMemo(() => {
    if (!product) return [];
    const images = [];
    if (product.image) images.push(product.image);
    if (product.image2) images.push(product.image2);
    if (product.image3) images.push(product.image3);
    if (product.image4) images.push(product.image4);
    if (product.image5) images.push(product.image5);
    return images.length > 0
      ? images
      : ["https://via.placeholder.com/400?text=No+Image"];
  }, [product]);

  const mainImage = productImages[selectedImageIndex];

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/400?text=Image+Unavailable";
  };

  // Keyboard navigation for the image gallery (left/right arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (productImages.length <= 1) return;
      if (e.key === "ArrowLeft") handlePreviousImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productImages.length]);

  const handleToggleWishlist = async () => {
    if (!user_id) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setWishlistLoading(true);
    const response = inWishlist
      ? await removeFromWishlist(user_id, product.id)
      : await addToWishlist(user_id, product.id);

    if (response.success) {
      setInWishlist(!inWishlist);
      setWishlistCount((prev) =>
        inWishlist ? Math.max(prev - 1, 0) : prev + 1,
      );
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!");
    } else {
      toast.error(response.message || "Something went wrong");
    }
    setWishlistLoading(false);
  };

  const handleAddToCart = async () => {
    if (!user_id) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    setAdding(true);
    const response = await addToCart(user_id, product.id, quantity);

    if (response.success) {
      toast.success("Added to cart successfully!");
      setQuantity(1);
    } else {
      toast.error("Failed to add to cart: " + response.message);
    }
    setAdding(false);
  };

  const handleBuyNow = () => {
    if (!user_id) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    navigate("/checkout", {
      state: {
        items: [{ product_id: product.id, quantity, price: product.price }],
      },
    });
  };

  // Quantity input - lets the field be cleared while typing without
  // snapping back to 1, but still clamps on blur.
  const handleQuantityInputChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      setQuantity("");
      return;
    }
    const value = parseInt(raw, 10);
    if (!isNaN(value)) {
      setQuantity(Math.min(Math.max(value, 1), product.stock));
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === "" || isNaN(quantity)) {
      setQuantity(1);
    }
  };

  const handleQuantityStep = (delta) => {
    setQuantity((prev) => {
      const current = prev === "" || isNaN(prev) ? 1 : prev;
      const next = current + delta;
      return Math.min(Math.max(next, 1), product.stock);
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <h2>⏳ Loading product details...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>❌ Product not found</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="product-details-container">
        <button className="back-btn" onClick={() => navigate("/products")}>
          ← Back to Products
        </button>

        <div className="product-details-content">
          {/* Product Image Gallery */}
          <div className="product-image-section">
            <div className="main-image-container">
              <button
                className="image-nav-btn prev-btn"
                onClick={handlePreviousImage}
                aria-label="Previous image"
              >
                ❮
              </button>
              <img
                src={mainImage}
                alt={product.name}
                className="product-image"
                onError={handleImageError}
              />
              <button
                className="image-nav-btn next-btn"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                ❯
              </button>
              <span className="image-counter">
                {selectedImageIndex + 1} / {productImages.length}
              </span>
            </div>

            {productImages.length > 1 && (
              <div className="thumbnail-gallery-below">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === selectedImageIndex ? "active" : ""}`}
                    onClick={() => setSelectedImageIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") setSelectedImageIndex(index);
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onError={handleImageError}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <h1 className="product-name">{product.name}</h1>

            <div className="product-price-section">
              <h2 className="product-price">
                ₹{product.price.toLocaleString("en-IN")}
              </h2>
              <span className="discount">15% OFF</span>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="stock-info">
              {product.stock > 0 ? (
                <p className="in-stock">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="out-of-stock">✗ Out of Stock</p>
              )}
            </div>

            <div className="quantity-section">
              <label htmlFor="quantity-input">Quantity:</label>
              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityStep(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  id="quantity-input"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInputChange}
                  onBlur={handleQuantityBlur}
                  min="1"
                  max={product.stock}
                  aria-label="Quantity"
                />
                <button
                  onClick={() => handleQuantityStep(1)}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-price">
              <p>
                Total:{" "}
                <span>
                  ₹
                  {(
                    product.price * (quantity === "" ? 0 : quantity)
                  ).toLocaleString("en-IN")}
                </span>
              </p>
            </div>

            <div className="action-buttons">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={adding || product.stock <= 0}
              >
                {adding ? "Adding..." : "🛒 Add to Cart"}
              </button>
              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                💳 Buy Now
              </button>
              <div className="wishlist-btn-wrapper">
                <button
                  className={`wishlist-btn ${inWishlist ? "active" : ""}`}
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  aria-label={
                    inWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  {inWishlist ? "❤️" : "🤍"}
                </button>
                {wishlistCount > 0 && (
                  <span className="wishlist-count">{wishlistCount}</span>
                )}
              </div>
            </div>

            <div className="product-features">
              <h3>Key Features:</h3>
              <ul>
                <li>✓ Free Shipping on orders above ₹500</li>
                <li>✓ 30-day Easy Returns</li>
                <li>✓ 1 Year Warranty</li>
                <li>✓ Secure Checkout</li>
                <li>✓ 100% Authentic Products</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="product-specs-section">
          <h2>Product Specifications</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Product ID:</span>
              <span className="spec-value">{product.id}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Category:</span>
              <span className="spec-value">
                Category {product.category_id}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">In Stock:</span>
              <span className="spec-value">{product.stock} units</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Shipping:</span>
              <span className="spec-value">2-3 business days</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews ({reviews.length})</h2>

          {reviewsLoading ? (
            <p className="reviews-loading">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <>
              <p className="reviews-note">
                📝 Reviews will appear once you purchase and receive this
                product
              </p>
              <div className="no-reviews">
                <p>
                  No reviews yet. Be the first to review this product after
                  purchase!
                </p>
              </div>
            </>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <h4 className="reviewer-name">👤 {review.userName}</h4>
                      <span className="review-rating">
                        ⭐ {review.rating}/5
                      </span>
                    </div>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>More Products in This Category</h2>
            <div className="related-products">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default ProductDetailsPage;