import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get user data from localStorage
  const username = localStorage.getItem('username');
  const user_id = localStorage.getItem('user_id');
  const [name, setName] = useState(username || '');
  const [email, setEmail] = useState('');

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      // Clear localStorage
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      
      alert('Logged out successfully!');
      navigate('/login');
    }
  };

  // Handle save profile (can add API later)
  const handleSaveProfile = () => {
    if (!name) {
      alert('Name cannot be empty');
      return;
    }
    
    localStorage.setItem('username', name);
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  // Check if user is logged in
  if (!user_id) {
    return (
      <div className="not-logged-in">
        <h2>Please login to view your profile</h2>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-content">
        
        {/* Profile Avatar */}
        <div className="profile-avatar">
          <div className="avatar-circle">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          
          {/* Display Mode */}
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
                <span className="label">Email:</span>
                <span className="value">{email || 'Not added'}</span>
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
            /* Edit Mode */
            <>
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

                <div className="form-group">
                  <label>Email:</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
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
            </>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <h3>Quick Links:</h3>
        <div className="links-grid">
          <button onClick={() => navigate('/')}>🏠 Home</button>
          <button onClick={() => navigate('/cart')}>🛒 Cart</button>
          <button onClick={() => navigate('/orders')}>📦 Orders</button>
          <button onClick={() => navigate('/')}>🛍️ Shop</button>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        className="logout-btn"
        onClick={handleLogout}
      >
        🚪 Logout
      </button>

      {/* Account Info */}
      <div className="account-info">
        <h3>Account Information:</h3>
        <ul>
          <li>✓ Secure Account</li>
          <li>✓ Order History</li>
          <li>✓ Wishlist</li>
          <li>✓ Address Book</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfilePage;