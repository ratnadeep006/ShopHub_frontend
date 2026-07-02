import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About */}
        <div className="footer-section">
          <h4>About ShopHub</h4>
          <p>Your one-stop shop for quality electronics and gadgets. We bring you the best deals, fast delivery, and top-notch support.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/orders">Orders</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <div className="footer-contact-item">
            <span className="icon">✉</span>
            <span>support@shophub.com</span>
          </div>
          <div className="footer-contact-item">
            <span className="icon">📞</span>
            <span>+91 123-456-7890</span>
          </div>
          <div className="footer-contact-item">
            <span className="icon">📍</span>
            <span>123 Tech Street, Indore, India</span>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© 2026 ShopHub. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#faq">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;