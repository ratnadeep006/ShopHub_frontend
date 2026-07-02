import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  // State for login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State for register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // State to toggle between login and register
  const [isLogin, setIsLogin] = useState(true);

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert('Please fill in all fields');
      return;
    }

    const response = await loginUser(loginEmail, loginPassword);

    if (response.success) {
      alert('Login successful!');

      // Store user data
      localStorage.setItem('user_id', response.data.id);
      localStorage.setItem('username', response.data.name);

      // Clear form fields
      setLoginEmail('');
      setLoginPassword('');

      // Redirect to home
      navigate('/');

    } else {
      alert('Invalid email or password');
    }
  };

  // Handle register submission
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) {
      alert('Please fill in all fields');
      return;
    }

    const response = await registerUser(registerName, registerEmail, registerPassword);

    if (response.success) {
      alert('Registration successful! Now login.');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setIsLogin(true);
    } else {
      alert('Registration failed: ' + response.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button type="submit">Login</button>

            <p>
              Don't have account?
              <button
                type="button"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister}>
            <h2>Register</h2>

            <input
              type="text"
              placeholder="Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />

            <button type="submit">Register</button>

            <p>
              Already have account?
              <button
                type="button"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}

export default LoginPage;