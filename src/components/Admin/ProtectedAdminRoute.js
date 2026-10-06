import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Wrap admin-only routes with this component:
 *
 *   <Route path="/admin" element={
 *     <ProtectedAdminRoute>
 *       <AdminDashboard />
 *     </ProtectedAdminRoute>
 *   } />
 *
 * It checks for a token and an admin role flag in localStorage.
 * Adjust the storage keys below to match whatever your login flow
 * actually saves (e.g. decoding the JWT instead, if that's how
 * the rest of the app determines role).
 */
const ProtectedAdminRoute = ({ children }) => {
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

export default ProtectedAdminRoute;