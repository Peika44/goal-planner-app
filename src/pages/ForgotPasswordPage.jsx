import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { resetPassword } from '../api/authApi';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      // Call reset password API
      const response = await resetPassword(email);

      if (response.success) {
        setSuccess(true);
        setEmail(''); // Clear the form after success
      } else {
        setError(response.error || 'Password reset failed. Please try again.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
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
      <div className="auth-panel">
        <h2 className="auth-title">
          Forgot Password
        </h2>
        
        <p className="auth-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Error Message Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message">
            Password reset instructions have been sent to your email.
            Please check your inbox.
          </div>
        )}

        {/* Reset Password Form */}
        {!success ? (
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
                placeholder="Email Address"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`auth-button ${loading ? 'disabled' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        ) : null}

        {/* Back to Login Link */}
        <p className="login-text">
          Remember your password?{' '}
          <Link to="/login" className="login-link">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;