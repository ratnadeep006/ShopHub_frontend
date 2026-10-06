import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Make sure all imports are DEFAULT imports
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminReturns from './AdminReturns';
import AdminCoupons from './AdminCoupons';
import AdminAnalytics from './AdminAnalytics';

const AdminPanel = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="returns" element={<AdminReturns />} />
      <Route path="coupons" element={<AdminCoupons />} />
      <Route path="analytics" element={<AdminAnalytics />} />
    </Routes>
  );
};

export default AdminPanel;