import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../../services/adminApi';
import '../../styles/Admin/AdminDashboard.css';
import '../../styles/Admin/AdminProducts.css';

const EMPTY_FORM = { name: '', price: '', stock: '', category: '', image: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const res = await getAllProducts();
    if (res.success) {
      setProducts(res.data || []);
    } else {
      setError(res.message || 'Could not load products.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(q));
  }, [products, search]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id || product.id);
    setForm({
      name: product.name || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      category: product.category || '',
      image: product.image || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === '') {
      setFormError('Name and price are required.');
      return;
    }
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
    };

    const res = editingId
      ? await updateProduct(editingId, payload)
      : await addProduct(payload);

    if (res.success) {
      setModalOpen(false);
      loadProducts();
    } else {
      setFormError(res.message || 'Could not save product.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } else {
      setError(res.message || 'Could not delete product.');
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <AdminNavbar
          title="Products"
          onSearch={setSearch}
          searchPlaceholder="Search products…"
        />
        <div className="admin-content__body">
          <div className="admin-toolbar">
            <button className="btn btn-primary" onClick={openAddModal}>
              + Add Product
            </button>
          </div>

          {loading && <div className="admin-state">Loading products…</div>}
          {!loading && error && <div className="admin-state error">{error}</div>}

          {!loading && !error && (
            <div className="admin-panel">
              <div className="admin-panel__header">
                <span className="admin-panel__title">
                  All Products ({filtered.length})
                </span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="admin-state">
                        No products found.
                      </td>
                    </tr>
                  )}
                  {filtered.map((product) => {
                    const id = product._id || product.id;
                    return (
                      <tr key={id}>
                        <td>
                          <div className="product-cell">
                            {product.image && (
                              <img
                                className="product-cell__thumb"
                                src={product.image}
                                alt={product.name}
                              />
                            )}
                            {product.name}
                          </div>
                        </td>
                        <td>{product.category || '—'}</td>
                        <td>${Number(product.price || 0).toFixed(2)}</td>
                        <td>{product.stock ?? 0}</td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => openEditModal(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card__header">
              <span className="modal-card__title">
                {editingId ? 'Edit Product' : 'Add Product'}
              </span>
              <button
                className="modal-card__close"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-card__body">
                {formError && <div className="form-error">{formError}</div>}
                <div className="form-field">
                  <label>Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleFormChange('price', e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => handleFormChange('stock', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Image URL</label>
                  <input
                    value={form.image}
                    onChange={(e) => handleFormChange('image', e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-card__footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;