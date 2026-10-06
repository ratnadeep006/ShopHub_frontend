import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import StatCard from '../../components/Admin/StatCard';
import { getAnalytics, getAllOrders } from '../../services/adminApi';
import '../../styles/Admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [analyticsRes, ordersRes] = await Promise.all([
        getAnalytics(),
        getAllOrders(),
      ]);

      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data);
      } else {
        setError(analyticsRes.message || 'Could not load analytics.');
      }

      if (ordersRes.success) {
        setRecentOrders((ordersRes.data || []).slice(0, 6));
      }

      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <AdminNavbar title="Dashboard" />
        <div className="admin-content__body">
          {loading && <div className="admin-state">Loading dashboard…</div>}
          {!loading && error && <div className="admin-state error">{error}</div>}

          {!loading && !error && (
            <>
              <div className="stat-grid">
                <StatCard
                  label="Total Revenue"
                  value={`$${(analytics?.totalRevenue ?? 0).toLocaleString()}`}
                  trend={analytics?.revenueTrend}
                />
                <StatCard
                  label="Total Orders"
                  value={(analytics?.totalOrders ?? 0).toLocaleString()}
                  trend={analytics?.ordersTrend}
                />
                <StatCard
                  label="Total Users"
                  value={(analytics?.totalUsers ?? 0).toLocaleString()}
                  trend={analytics?.usersTrend}
                />
                <StatCard
                  label="Total Products"
                  value={(analytics?.totalProducts ?? 0).toLocaleString()}
                />
              </div>

              <div className="admin-panel">
                <div className="admin-panel__header">
                  <span className="admin-panel__title">Recent Orders</span>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="admin-state">
                          No recent orders.
                        </td>
                      </tr>
                    )}
                    {recentOrders.map((order) => (
                      <tr key={order._id || order.id}>
                        <td className="admin-mono">#{order._id || order.id}</td>
                        <td>{order.customerName || order.user?.name || '—'}</td>
                        <td>${Number(order.total || 0).toFixed(2)}</td>
                        <td>
                          <span className={`stamp ${(order.status || 'pending').toLowerCase()}`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="admin-mono">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;