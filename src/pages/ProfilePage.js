import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ProfilePage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    is_default: false
  });

  // Get user data from localStorage
  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");
  const [name, setName] = useState(username || "");

  // Fetch addresses
  useEffect(() => {
    if (activeTab === 'addresses' && user_id) {
      fetchAddresses();
    }
  }, [activeTab, user_id]);

  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/addresses/${user_id}`
      );
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data || []);
      }
    } catch (error) {
      toast.error('Error loading addresses');
    }
    setAddressLoading(false);
  };

  // Handle address form change
  const handleAddressFormChange = (field, value) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle add/edit address
  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!addressForm.address || !addressForm.city || 
        !addressForm.state || !addressForm.pincode || 
        !addressForm.phone) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      let response;

      if (editingAddress) {
        // Update existing address
        response = await fetch(
          `http://localhost:5000/api/addresses/${editingAddress.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...addressForm, user_id })
          }
        );
      } else {
        // Add new address
        response = await fetch(
          `http://localhost:5000/api/addresses/${user_id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressForm)
          }
        );
      }

      const data = await response.json();

      if (data.success) {
        toast.success(editingAddress ? 'Address updated!' : 'Address added!');
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({
          address: '', city: '', state: '',
          pincode: '', phone: '', is_default: false
        });
        fetchAddresses();
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (address_id) => {
    if (!window.confirm('Delete this address?')) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/addresses/${address_id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Address deleted!');
        fetchAddresses();
      } else {
        toast.error(data.message || 'Could not delete address');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  // Handle set default address
  const handleSetDefault = async (address_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/addresses/${address_id}/default`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Default address updated!');
        fetchAddresses();
      } else {
        toast.error(data.message || 'Could not set default');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  // Open edit address form
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      is_default: address.is_default
    });
    setShowAddressForm(true);
  };

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      toast.success("Logged out successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    }
  };

  // Handle save profile
  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast.warning("Name cannot be empty.");
      return;
    }

    localStorage.setItem("username", name);
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  // Check if user is logged in
  if (!user_id) {
    return (
      <>
        <Navbar />
        <div className="not-logged-in">
          <h2>Please login to view your profile</h2>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>My Account</h2>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          > 
            📍 Addresses
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => navigate('/orders')}
          >
            📦 Orders
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-content">
            {/* Profile Avatar */}
            <div className="profile-avatar">
              <div className="avatar-circle">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              {!isEditing ? (
                <>
                  <div className="info-row">
                    <span className="label">User ID:</span>
                    <span className="value">{user_id}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Name:</span>
                    <span className="value">{name}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Member Since:</span>
                    <span className="value">{new Date().getFullYear()}</span>
                  </div>

                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                </>
              ) : (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="edit-buttons">
                    <button
                      className="save-btn"
                      onClick={handleSaveProfile}
                    >
                      💾 Save Changes
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="quick-links">
              <h3>Quick Links:</h3>
              <div className="links-grid">
                <button onClick={() => navigate("/")}>🏠 Home</button>
                <button onClick={() => navigate("/cart")}>🛒 Cart</button>
                <button onClick={() => navigate("/orders")}>📦 Orders</button>
                <button onClick={() => navigate("/products")}>🛍️ Shop</button>
              </div>
            </div>

            {/* Logout Button */}
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="addresses-section">
            <div className="addresses-header">
              <h3>My Addresses</h3>
              <button
                className="add-address-btn"
                onClick={() => {
                  setEditingAddress(null);
                  setAddressForm({
                    address: '', city: '', state: '',
                    pincode: '', phone: '', is_default: false
                  });
                  setShowAddressForm(true);
                }}
              >
                ➕ Add New Address
              </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <div className="address-form-card">
                <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                <form onSubmit={handleSaveAddress}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        placeholder="Enter street address"
                        value={addressForm.address}
                        onChange={(e) =>
                          handleAddressFormChange('address', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        placeholder="Enter city"
                        value={addressForm.city}
                        onChange={(e) =>
                          handleAddressFormChange('city', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        placeholder="Enter state"
                        value={addressForm.state}
                        onChange={(e) =>
                          handleAddressFormChange('state', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        placeholder="Enter pincode"
                        value={addressForm.pincode}
                        onChange={(e) =>
                          handleAddressFormChange('pincode', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        placeholder="Enter phone number"
                        value={addressForm.phone}
                        onChange={(e) =>
                          handleAddressFormChange('phone', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={addressForm.is_default}
                          onChange={(e) =>
                            handleAddressFormChange('is_default', e.target.checked)
                          }
                        />
                        Set as Default Address
                      </label>
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="save-btn">
                      💾 {editingAddress ? 'Update Address' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address List */}
            {addressLoading ? (
              <div className="loading">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="no-addresses">
                <p>📍 No addresses saved yet!</p>
                <p>Add an address to make checkout faster!</p>
              </div>
            ) : (
              <div className="addresses-list">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`address-card ${addr.is_default ? 'default' : ''}`}
                  >
                    {addr.is_default && (
                      <span className="default-badge">✅ Default</span>
                    )}
                    <p className="address-text">
                      📍 {addr.address}
                    </p>
                    <p className="address-details">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="address-phone">
                      📞 {addr.phone}
                    </p>

                    <div className="address-actions">
                      <button
                        className="edit-address-btn"
                        onClick={() => handleEditAddress(addr)}
                      >
                        ✏️ Edit
                      </button>
                      {!addr.is_default && (
                        <button
                          className="default-btn"
                          onClick={() => handleSetDefault(addr.id)}
                        >
                          ⭐ Set Default
                        </button>
                      )}
                      <button
                        className="delete-address-btn"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;