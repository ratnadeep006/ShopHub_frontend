import { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { getAllProducts } from '../services/api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllProducts(
        page,
        10,
        searchQuery,
        selectedCategory
      );

      if (response.success) {
        let data = response.data;

        // Sort products
        if (sortBy === 'price-low') {
          data = [...data].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          data = [...data].sort((a, b) => b.price - a.price);
        }

        setProducts(data);
        setTotalPages(response.pagination.totalPages);
        setTotalProducts(response.pagination.totalProducts);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, selectedCategory, sortBy]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(1);
  };

  return (
    <>
      <Navbar />

      {/* Filters Section */}
      <div className="filters-section">

        {/* Search */}
        <div className="search-bar-section">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button
            className="search-btn"
            onClick={handleSearch}
          >
            🔍 Search
          </button>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="1">Electronics</option>
            <option value="2">Clothing</option>
            <option value="3">Books</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="results-count">
          Showing {products.length} of {totalProducts} products
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h2>All Products</h2>

        {loading ? (
          <div className="loading-products">⏳ Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-products">
            <h2>No products found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            ««
          </button>

          <button
            className="page-btn"
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>

          <button
            className="page-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »»
          </button>
        </div>
      )}

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

      <Footer />
    </>
  );
}

export default ProductsPage;