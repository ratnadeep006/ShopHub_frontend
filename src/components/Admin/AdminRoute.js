import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Route guard for admin-only pages. Checks for a token and an
 * admin role flag in localStorage — adjust the storage keys below
 * if your login flow saves these under different names (or if you
 * decode the role from a JWT instead).
 *
 * Usage in App.js:
 *   <Route path="/admin/*" element={
 *     <AdminRoute><AdminPanel /></AdminRoute>
 *   } />
 */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;