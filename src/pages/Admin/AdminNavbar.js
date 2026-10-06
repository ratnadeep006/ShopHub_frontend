// frontend/src/components/Admin/AdminNavbar.js
import '../../styles/Admin/AdminNavbar.css';

function AdminNavbar({ title, onSearch, searchPlaceholder }) {
  return (
    <div className="admin-navbar">
      <h1>{title}</h1>
      {onSearch && (
        <input 
          type="text" 
          placeholder={searchPlaceholder || "Search…"}
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
      )}
    </div>
  );
}

export default AdminNavbar;