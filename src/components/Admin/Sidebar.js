import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/Admin/Sidebar.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '01', end: true },
  { to: '/admin/users', label: 'Users', icon: '02' },
  { to: '/admin/products', label: 'Products', icon: '03' },
  { to: '/admin/orders', label: 'Orders', icon: '04' },
  { to: '/admin/returns', label: 'Returns', icon: '05' },
  { to: '/admin/coupons', label: 'Coupons', icon: '06' },
  { to: '/admin/analytics', label: 'Analytics', icon: '07' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('user_id');
  navigate('/login');
};

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__brand-mark">ShopHub</div>
        <div className="admin-sidebar__brand-tag">Admin Console</div>
      </div>

      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'admin-sidebar__link active' : 'admin-sidebar__link'
            }
          >
            <span className="admin-sidebar__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <button className="admin-sidebar__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;