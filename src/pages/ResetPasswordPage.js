import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ForgotPasswordPage.css';

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="forgot-password-container">
        <div className="forgot-password-card">

          {!success ? (
            <>
              <h2>🔑 Reset Password</h2>
              <p className="subtitle">Enter your new password below</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="email-sent">
              <div className="success-icon">✅</div>
              <h2>Password Reset!</h2>
              <p>Your password has been reset successfully!</p>
              <button
                className="submit-btn"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPasswordPage;