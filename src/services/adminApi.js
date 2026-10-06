const API_URL = "http://localhost:5000/api/admin";

const getToken = () => localStorage.getItem('token');

// ============ USERS ============
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

// ============ ORDERS ============
export const getAllOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

// ============ PRODUCTS ============
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(productData)
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(productData)
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

// ============ COUPONS ============
export const getAllCoupons = async () => {
  try {
    const response = await fetch(`${API_URL}/coupons`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const addCoupon = async (couponData) => {
  try {
    const response = await fetch(`${API_URL}/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(couponData)
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await fetch(`${API_URL}/coupons/${couponId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(couponData)
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const response = await fetch(`${API_URL}/coupons/${couponId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

// ============ RETURNS ============
export const getAllReturns = async () => {
  try {
    const response = await fetch(`${API_URL}/returns`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const approveReturn = async (returnId) => {
  try {
    const response = await fetch(`${API_URL}/returns/${returnId}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const rejectReturn = async (returnId) => {
  try {
    const response = await fetch(`${API_URL}/returns/${returnId}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

// ============ ANALYTICS ============
export const getAnalytics = async () => {
  try {
    const response = await fetch(`${API_URL}/analytics`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};