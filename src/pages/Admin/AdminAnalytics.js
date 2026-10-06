import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import StatCard from '../../components/Admin/StatCard';
import { getAnalytics } from '../../services/adminApi';
import '../../styles/Admin/AdminDashboard.css';
import '../../styles/Admin/AdminAnalytics.css';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getAnalytics();
      if (res.success) {
        setAnalytics(res.data);
      } else {
        setError(res.message || 'Could not load analytics.');
      }
      setLoading(false);
    };
    load();
  }, []);

  // Expects analytics.monthlyRevenue like [{ month: 'Jan', revenue: 4200 }, ...]
  const monthly = analytics?.monthlyRevenue || [];
  const maxRevenue = Math.max(...monthly.map((m) => m.revenue || 0), 1);

  const topProducts = analytics?.topProducts || [];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <AdminNavbar title="Analytics" />
        <div className="admin-content__body">
          {loading && <div className="admin-state">Loading analytics…</div>}
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
                  label="Avg. Order Value"
                  value={`$${(analytics?.avgOrderValue ?? 0).toFixed(2)}`}
                />
                <StatCard
                  label="Conversion Rate"
                  value={`${analytics?.conversionRate ?? 0}%`}
                />
                <StatCard
                  label="Return Rate"
                  value={`${analytics?.returnRate ?? 0}%`}
                />
              </div>

              <div className="analytics-grid">
                <div className="admin-panel">
                  <div className="admin-panel__header">
                    <span className="admin-panel__title">Revenue by Month</span>
                  </div>
                  <div className="chart-panel">
                    {monthly.length === 0 ? (
                      <div className="admin-state">No revenue data yet.</div>
                    ) : (
                      <div className="bar-chart">
                        {monthly.map((m) => (
                          <div className="bar-chart__col" key={m.month}>
                            <div
                              className="bar-chart__bar"
                              data-value={`$${(m.revenue || 0).toLocaleString()}`}
                              style={{
                                height: `${((m.revenue || 0) / maxRevenue) * 100}%`,
                              }}
                            />
                            <span className="bar-chart__label">{m.month}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-panel">
                  <div className="admin-panel__header">
                    <span className="admin-panel__title">Top Products</span>
                  </div>
                  <div className="top-products-list">
                    {topProducts.length === 0 && (
                      <div className="admin-state">No product data yet.</div>
                    )}
                    {topProducts.map((p, i) => (
                      <div className="top-products-list__row" key={p.name || i}>
                        <span>
                          <span className="top-products-list__rank">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {p.name}
                        </span>
                        <span className="admin-mono">{p.unitsSold ?? p.sales ?? 0} sold</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;