import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setEmailSent(true);
        toast.success('Reset email sent!');
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
          
          {!emailSent ? (
            <>
              <h2>🔐 Forgot Password</h2>
              <p className="subtitle">
                Enter your email and we'll send you a reset link
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="back-to-login">
                <button onClick={() => navigate('/login')}>
                  ← Back to Login
                </button>
              </div>
            </>
          ) : (
            <div className="email-sent">
              <div className="success-icon">📧</div>
              <h2>Email Sent!</h2>
              <p>
                We've sent a password reset link to:
                <strong> {email}</strong>
              </p>
              <p className="note">
                ⚠️ Link will expire in 1 hour.
                Check your spam folder if not received.
              </p>
              <button
                className="submit-btn"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPasswordPage;