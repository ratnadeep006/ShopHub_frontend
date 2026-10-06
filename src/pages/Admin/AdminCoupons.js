import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import {
  getAllCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from '../../services/adminApi';
import '../../styles/Admin/AdminDashboard.css';
import '../../styles/Admin/AdminProducts.css'; // reuse modal + toolbar styles
import '../../styles/Admin/AdminCoupons.css';

const EMPTY_FORM = { code: '', discount: '', expiresAt: '', active: true };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    const res = await getAllCoupons();
    if (res.success) {
      setCoupons(res.data || []);
    } else {
      setError(res.message || 'Could not load coupons.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingId(coupon._id || coupon.id);
    setForm({
      code: coupon.code || '',
      discount: coupon.discount ?? '',
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      active: coupon.active ?? true,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || form.discount === '') {
      setFormError('Code and discount are required.');
      return;
    }
    setSaving(true);
    setFormError('');

    const payload = { ...form, discount: Number(form.discount) };
    const res = editingId
      ? await updateCoupon(editingId, payload)
      : await addCoupon(payload);

    if (res.success) {
      setModalOpen(false);
      loadCoupons();
    } else {
      setFormError(res.message || 'Could not save coupon.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    const res = await deleteCoupon(id);
    if (res.success) {
      setCoupons((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } else {
      setError(res.message || 'Could not delete coupon.');
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <AdminNavbar title="Coupons" />
        <div className="admin-content__body">
          <div className="admin-toolbar">
            <button className="btn btn-primary" onClick={openAddModal}>
              + Add Coupon
            </button>
          </div>

          {loading && <div className="admin-state">Loading coupons…</div>}
          {!loading && error && <div className="admin-state error">{error}</div>}

          {!loading && !error && (
            <div className="admin-panel">
              <div className="admin-panel__header">
                <span className="admin-panel__title">
                  All Coupons ({coupons.length})
                </span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={5} className="admin-state">
                        No coupons found.
                      </td>
                    </tr>
                  )}
                  {coupons.map((coupon) => {
                    const id = coupon._id || coupon.id;
                    return (
                      <tr key={id}>
                        <td>
                          <span className="coupon-code">{coupon.code}</span>
                        </td>
                        <td>{coupon.discount}%</td>
                        <td className="admin-mono">
                          {coupon.expiresAt
                            ? new Date(coupon.expiresAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td>
                          <span className={`stamp ${coupon.active ? 'approved' : 'cancelled'}`}>
                            {coupon.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => openEditModal(coupon)}
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
                {editingId ? 'Edit Coupon' : 'Add Coupon'}
              </span>
              <button className="modal-card__close" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-card__body">
                {formError && <div className="form-error">{formError}</div>}
                <div className="form-field">
                  <label>Coupon Code</label>
                  <input
                    value={form.code}
                    onChange={(e) =>
                      handleFormChange('code', e.target.value.toUpperCase())
                    }
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      value={form.discount}
                      onChange={(e) => handleFormChange('discount', e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Expires On</label>
                    <input
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) => handleFormChange('expiresAt', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select
                    value={form.active ? 'active' : 'inactive'}
                    onChange={(e) =>
                      handleFormChange('active', e.target.value === 'active')
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  {saving ? 'Saving…' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;