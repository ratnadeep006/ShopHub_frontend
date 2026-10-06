import React from 'react';
import '../../styles/Admin/AdminNavbar.css';

const AdminNavbar = ({ title, onSearch, searchPlaceholder = 'Search…' }) => {
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <header className="admin-navbar">
      <h1 className="admin-navbar__title">{title}</h1>

      <div className="admin-navbar__right">
        {onSearch && (
          <div className="admin-navbar__search">
            <span className="admin-navbar__search-icon">Q</span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}

        <div className="admin-navbar__profile">
          <div className="admin-navbar__avatar">{initial}</div>
          <div>
            <div className="admin-navbar__name">{adminName}</div>
            <div className="admin-navbar__role">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;