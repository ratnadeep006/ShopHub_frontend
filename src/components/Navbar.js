import "../styles/Navbar.css";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Check if user is logged in
  const user_id = localStorage.getItem("user_id");
  const isLoggedIn = !!user_id;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token"); // remove this line if you don't use token
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