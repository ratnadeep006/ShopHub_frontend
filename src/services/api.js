const API_URL = "http://localhost:5000/api";

export const getAllProducts = async (page = 1, limit = 10, search = '', category = '') => {
  try {
    const response = await fetch(
      `${API_URL}/products?page=${page}&limit=${limit}&search=${search}&category=${category}`
    );
    const data = await response.json();

    // Ensure 'data.data' is always an array, even if backend sends something unexpected
    return {
      success: data.success ?? true,
      data: Array.isArray(data.data) ? data.data : [],
      pagination: data.pagination || {},
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, data: [], pagination: {} };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: 'Network error' };
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: name,
        email: email,
        password: password
      })
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error registering:", error);
    return { success: false, message: 'Network error' };
  }
};

export const addToCart = async (user_id, product_id, quantity = 1) => {
  try {
    const response = await fetch(`${API_URL}/cart/${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: product_id,
        quantity: quantity
      })
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: 'Network error' };
  }
};

export const getCart = async (user_id) => {
  try {
    const response = await fetch(`${API_URL}/cart/${user_id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { success: false, message: 'Network error' };
  }
};

export const updateCartQuantity = async (user_id, product_id, quantity) => {
  try {
    const response = await fetch(`${API_URL}/cart/${user_id}/${product_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: quantity })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, message: 'Network error' };
  }
};

export const removeFromCart = async (user_id, product_id) => {
  try {
    const response = await fetch(`${API_URL}/cart/${user_id}/${product_id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, message: 'Network error' };
  }
};

export const createOrder = async (
  user_id,
  address_id,
  coupon_code = null,
  discount = 0
) => {
  try {
    const response = await fetch(`${API_URL}/order/${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address_id,
        coupon_code,
        discount
      })
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error creating order:", error);

    return {
      success: false,
      message: 'Network error'
    };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, message: 'Network error' };
  }
};

export const getUserOrders = async (user_id) => {
  try {
    const response = await fetch(`${API_URL}/order/${user_id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, message: 'Network error' };
  }
};

export const getProductReviews = async (product_id) => {
  try {
    const response = await fetch(
      `${API_URL}/reviews/product/${product_id}`
    );
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addToWishlist = async (user_id, product_id) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlist/${user_id}/${product_id}`,
      { method: "POST" }
    );
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const removeFromWishlist = async (user_id, product_id) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlist/${user_id}/${product_id}`,
      { method: "DELETE" }
    );
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const checkWishlist = async (user_id, product_id) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlist/check/${user_id}/${product_id}`
    );
    return await response.json();
  } catch (error) {
    return { success: false, inWishlist: false };
  }
};

export const getWishlistCount = async (user_id) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlist/count/${user_id}`
    );
    return await response.json();
  } catch (error) {
    return { success: false, count: 0 };
  }
};

export const getWishlist = async (user_id) => {
  try {
    const response = await fetch(`${API_URL}/wishlist/${user_id}`);
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
};