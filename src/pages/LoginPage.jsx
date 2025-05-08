import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/authApi';
import './AuthPages.css'; // Import the shared CSS file

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call login API
      const response = await login({ email, password });

      if (response.success) {
        setCurrentUser(response.user);
        // Handle "Remember me" logic if needed
        console.log("Remember Me:", rememberMe);
        navigate('/dashboard');
      } else {
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="auth-container"
      style={{ backgroundImage: `url('/images/login-background.jpg')` }}
    >
      {/* Transparent Login Panel */}
      <div className="auth-panel">
        <h2 className="auth-title">
          Login
        </h2>

        {/* Error Message Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Input */}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Email ID"
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Password"
            />
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="form-row">
            <div className="remember-me">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox"
              />
              <label htmlFor="remember-me" className="checkbox-label">
                Remember me
              </label>
            </div>

            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`login-button ${loading ? 'disabled' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="register-text">
          Don't have an account?{' '}
          <Link to="/register" className="register-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;