import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/WishlistPage.css";
import { getWishlist, addToCart } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

function WishlistPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingAll, setAddingAll] = useState(false);

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) {
      navigate("/login");
      return;
    }

    const fetchWishlist = async () => {
      setLoading(true);
      const response = await getWishlist(user_id);
      if (response.success) {
        setItems(response.data || []);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [user_id, navigate]);

  // Remove the item from the page immediately when its heart is un-clicked,
  // instead of waiting for a refresh.
  const handleRemove = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Add every wishlist item to the cart in one go
  const handleAddAllToCart = async () => {
    if (items.length === 0 || addingAll) return;

    setAddingAll(true);

    const results = await Promise.all(
      items.map((item) => addToCart(user_id, item.id, 1)),
    );

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    if (successCount > 0) {
      toast.success(
        `Added ${successCount} item${successCount > 1 ? "s" : ""} to cart!`,
      );
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} item${failCount > 1 ? "s" : ""} couldn't be added (maybe out of stock).`,
      );
    }

    setAddingAll(false);
  };

  return (
    <>
      <Navbar />

      <div className="wishlist-page-container">
        <div className="wishlist-header">
          <div>
            <h1 className="wishlist-title">My Wishlist</h1>
            {!loading && items.length > 0 && (
              <p className="wishlist-subtitle">
                {items.length} item{items.length > 1 ? "s" : ""} saved
              </p>
            )}
          </div>

          {!loading && items.length > 0 && (
            <button
              className="wishlist-add-all-btn"
              onClick={handleAddAllToCart}
              disabled={addingAll}
            >
              {addingAll ? "Adding..." : "🛒 Add All to Cart"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="wishlist-loading">
            <div className="wishlist-spinner" />
            <p>Loading your wishlist...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="wishlist-empty">
            <p className="wishlist-empty-icon">🤍</p>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love by tapping the heart on any product.</p>
            <button
              className="wishlist-browse-btn"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onRemoveFromWishlist={handleRemove}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default WishlistPage;