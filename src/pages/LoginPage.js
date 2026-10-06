import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, registerUser } from "../services/api";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Toggle Login/Register
  const [isLogin, setIsLogin] = useState(true);

  // Loading State
  const [loading, setLoading] = useState(false);

  // ================= LOGIN =================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.warning("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(loginEmail, loginPassword);

      if (response.success) {
        toast.success(`Welcome back, ${response.data.name}!`);

        localStorage.setItem("user_id", response.data.id);
        localStorage.setItem("username", response.data.name);
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.data.role);

        setLoginEmail("");
        setLoginPassword("");

        setTimeout(() => {
          if (response.data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1200);
      } else {
        toast.error(response.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim()
    ) {
      toast.warning("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(
        registerName,
        registerEmail,
        registerPassword,
      );

      if (response.success) {
        toast.success("Registration Successful!");

        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");

        setTimeout(() => {
          setIsLogin(true);
        }, 1200);
      } else {
        toast.error(response.message || "Registration Failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>{isLogin ? "Welcome Back 👋" : "Create Account"}</h2>

          <p>
            {isLogin
              ? "Login to continue shopping."
              : "Register to start shopping."}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <div className="forgot-password-link">
              <a href="/forgot-password" className="forgot-password-text">
                Forgot Password?
              </a>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>

            <p className="switch-text">
              Don't have an account?
              <button
                type="button"
                className="switch-btn"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Enter your name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Create a password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>

            <p className="switch-text">
              Already have an account?
              <button
                type="button"
                className="switch-btn"
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