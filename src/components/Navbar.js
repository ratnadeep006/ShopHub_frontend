import "../styles/Navbar.css";
import { useState, useEffect } from "react";
import { getWishlistCount } from "../services/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Check if user is logged in
  const user_id = localStorage.getItem("user_id");
  const isLoggedIn = !!user_id;

  // Fetch wishlist count for the badge, and keep it in sync whenever
  // a ProductCard adds/removes something from the wishlist anywhere on the site
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!user_id) return;
      const response = await getWishlistCount(user_id);
      if (response.success) {
        setWishlistCount(response.count);
      }
    };

    fetchWishlistCount();

    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    return () => {
      window.removeEventListener("wishlistUpdated", fetchWishlistCount);
    };
  }, [user_id]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token"); 
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <a href="/" className="navbar-logo">
          🛍️ <span>ShopHub</span>
        </a>

        {/* Desktop links */}
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/orders">Orders</a></li>
        </ul>

        {/* Right side */}
        <div className="nav-right">
          {isLoggedIn && (
            <a href="/wishlist" className="nav-wishlist" aria-label="Wishlist">
              ❤️ <span className="nav-wishlist-label">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="nav-wishlist-count">{wishlistCount}</span>
              )}
            </a>
          )}

          <a href="/cart" className="nav-cart" aria-label="Cart">
            🛒 <span className="nav-cart-label">Cart</span>
          </a>

          {isLoggedIn && (
            <a href="/profile" className="nav-icon-btn" aria-label="Profile">
              👤
            </a>
          )}

          {isLoggedIn ? (
            <button className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a href="/login" className="nav-login-btn">Login</a>
          )}

          {/* Hamburger */}
          <button
            className={`nav-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="/products" onClick={() => setMenuOpen(false)}>Products</a>
        <a href="/cart" onClick={() => setMenuOpen(false)}>🛒 Cart</a>
        <a href="/orders" onClick={() => setMenuOpen(false)}>Orders</a>

        {isLoggedIn && (
          <a href="/wishlist" onClick={() => setMenuOpen(false)}>
            ❤️ Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </a>
        )}

        {isLoggedIn && (
          <a href="/profile" onClick={() => setMenuOpen(false)}>👤 Profile</a>
        )}

        {isLoggedIn ? (
          <button
            className="mobile-logout"
            onClick={() => { setMenuOpen(false); handleLogout(); }}
          >
            Logout
          </button>
        ) : (
          <a href="/login" className="mobile-login" onClick={() => setMenuOpen(false)}>
            Login
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;