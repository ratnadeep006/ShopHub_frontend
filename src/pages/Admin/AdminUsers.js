import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import { getAllUsers, deleteUser } from '../../services/adminApi';
import '../../styles/Admin/AdminDashboard.css';
import '../../styles/Admin/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    const res = await getAllUsers();
    if (res.success) {
      setUsers(res.data || []);
    } else {
      setError(res.message || 'Could not load users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    const res = await deleteUser(id);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } else {
      setError(res.message || 'Could not delete user.');
    }
    setDeletingId(null);
    setConfirmingId(null);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <AdminNavbar
          title="Users"
          onSearch={setSearch}
          searchPlaceholder="Search by name or email…"
        />
        <div className="admin-content__body">
          {loading && <div className="admin-state">Loading users…</div>}
          {!loading && error && <div className="admin-state error">{error}</div>}

          {!loading && !error && (
            <div className="admin-panel">
              <div className="admin-panel__header">
                <span className="admin-panel__title">
                  All Users ({filteredUsers.length})
                </span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="admin-state">
                        No users found.
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((user) => {
                    const id = user._id || user.id;
                    return (
                      <tr key={id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-cell__avatar">
                              {(user.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="user-cell__name">{user.name}</div>
                              <div className="user-cell__email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="stamp pending">{user.role || 'user'}</span>
                        </td>
                        <td className="admin-mono">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td>
                          {confirmingId === id ? (
                            <div className="confirm-bar">
                              Delete this user?
                              <button
                                className="btn btn-danger btn-sm"
                                disabled={deletingId === id}
                                onClick={() => handleDelete(id)}
                              >
                                {deletingId === id ? 'Deleting…' : 'Confirm'}
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setConfirmingId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="row-actions">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => setConfirmingId(id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
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

export default AdminUsers;  