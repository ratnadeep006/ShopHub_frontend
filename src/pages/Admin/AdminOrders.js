import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import { getAllOrders, updateOrderStatus } from '../../services/adminApi';
import '../../styles/Admin/AdminDashboard.css';
import '../../styles/Admin/AdminOrders.css';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const FILTERS = ['All', ...STATUSES];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    const res = await getAllOrders();
    if (res.success) {
      setOrders(res.data || []);
    } else {
      setError(res.message || 'Could not load orders.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (filter !== 'All') {
      list = list.filter(
        (o) => (o.status || 'Pending').toLowerCase() === filter.toLowerCase()
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          String(o._id || o.id).toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, filter, search]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatus(orderId, status);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          (o._id || o.id) === orderId ? { ...o, status } : o
        )
      );
    } else {
      setError(res.message || 'Could not update order status.');
    }
    setUpdatingId(null);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <AdminNavbar
          title="Orders"
          onSearch={setSearch}
          searchPlaceholder="Search by order ID or customer…"
        />
        <div className="admin-content__body">
          <div className="filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {loading && <div className="admin-state">Loading orders…</div>}
          {!loading && error && <div className="admin-state error">{error}</div>}

          {!loading && !error && (
            <div className="admin-panel">
              <div className="admin-panel__header">
                <span className="admin-panel__title">
                  Orders ({filteredOrders.length})
                </span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="admin-state">
                        No orders found.
                      </td>
                    </tr>
                  )}
                  {filteredOrders.map((order) => {
                    const id = order._id || order.id;
                    return (
                      <tr key={id}>
                        <td className="order-id">#{id}</td>
                        <td>{order.customerName || order.user?.name || '—'}</td>
                        <td>${Number(order.total || 0).toFixed(2)}</td>
                        <td className="admin-mono">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status || 'Pending'}
                            disabled={updatingId === id}
                            onChange={(e) => handleStatusChange(id, e.target.value)}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
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
    </div>
  );
};

export default AdminOrders;