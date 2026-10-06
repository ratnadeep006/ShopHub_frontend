import { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { getAllProducts } from '../services/api';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getAllProducts();
        const productsArray = response.data || []; // unwrap the array safely
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterAndSortProducts(query, selectedCategory, sortBy);
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterAndSortProducts(searchQuery, category, sortBy);
  };

  // Handle sorting
  const handleSort = (sort) => {
    setSortBy(sort);
    filterAndSortProducts(searchQuery, selectedCategory, sort);
  };

  // Filter and sort products
  const filterAndSortProducts = (search, category, sort) => {
    let filtered = [...products]; // copy, so we never mutate the original 'products' state

    // Search filter
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category_id === parseInt(category));
    }

    // Sorting (safe now since 'filtered' is already a separate copy)
    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'popular':
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  // Handle newsletter signup
  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
      setShowNewsletterModal(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ShopHub</h1>
          <p>Discover amazing products at unbeatable prices!</p>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍 Search</button>
          </div>
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="offer-banner">
        <span>🎉 Special Offer: Get 15% OFF on your first purchase! Use code SHOP15</span>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="1">Electronics</option>
            <option value="2">Clothing</option>
            <option value="3">Books</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="filter-select"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="results-count">
          Showing {filteredProducts.length} products
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h2>Featured Products</h2>

        {loading ? (
          <div className="loading-products">⏳ Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-products">
            <h2>No products found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="products">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="trust-section">
        <div className="trust-badge">
          <span className="badge-icon">🚚</span>
          <p>Free Shipping on Orders Above ₹500</p>
        </div>
        <div className="trust-badge">
          <span className="badge-icon">✅</span>
          <p>100% Authentic Products</p>
        </div>
        <div className="trust-badge">
          <span className="badge-icon">🔄</span>
          <p>Easy 30-Day Returns</p>
        </div>
        <div className="trust-badge">
          <span className="badge-icon">🔒</span>
          <p>Secure Checkout & Payment</p>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <h3>Stay Updated!</h3>
        <p>Subscribe to get special offers and updates</p>
        <form onSubmit={handleNewsletterSignup} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h3>What Our Customers Say</h3>
        <div className="testimonials">
          <div className="testimonial-card">
            <p className="rating">⭐⭐⭐⭐⭐</p>
            <p className="text">"Great products and fast delivery! Highly recommend ShopHub."</p>
            <p className="author">- Rahul Kumar</p>
          </div>
          <div className="testimonial-card">
            <p className="rating">⭐⭐⭐⭐⭐</p>
            <p className="text">"Best prices I found online. Amazing customer service!"</p>
            <p className="author">- Priya Singh</p>
          </div>
          <div className="testimonial-card">
            <p className="rating">⭐⭐⭐⭐⭐</p>
            <p className="text">"Very satisfied with my purchase. Will shop again!"</p>
            <p className="author">- Amit Patel</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default HomePage;