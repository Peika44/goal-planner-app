import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/authApi';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Create update data (don't send empty password)
    const updateData = { ...formData };
    if (!updateData.password) {
      delete updateData.password;
    }
    delete updateData.confirmPassword;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await updateProfile(updateData);
      
      if (response.success) {
        // Update user data in context
        setCurrentUser(response.user);
        
        // Show success message
        setSuccess('Profile updated successfully');
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Profile Settings</h1>
        <Link to="/dashboard" className="dashboard-button dashboard-button-small">
          <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      {/* Content Panel with frosted glass effect */}
      <div className="dashboard-panel">
        {error && (
          <div className="dashboard-alert dashboard-alert-error">
            <div className="dashboard-alert-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7v-2h2v2h-2zm0-8v4h2V7h-2z" />
              </svg>
            </div>
            <div className="dashboard-alert-content">
              <h3 className="dashboard-alert-title">{error}</h3>
            </div>
          </div>
        )}
        
        {success && (
          <div className="dashboard-alert dashboard-alert-success">
            <div className="dashboard-alert-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-6.5l-4-4 1.41-1.41L11 13.17l5.18-5.17 1.41 1.41-7.09 7.09z" />
              </svg>
            </div>
            <div className="dashboard-alert-content">
              <h3 className="dashboard-alert-title">{success}</h3>
            </div>
          </div>
        )}
        
        <div className="dashboard-profile-form">
          <form onSubmit={handleSubmit}>
            <div className="dashboard-profile-section">
              <h2 className="dashboard-profile-section-title">Personal Information</h2>
              
              <div className="dashboard-profile-grid">
                <div className="dashboard-form-group">
                  <label htmlFor="firstName" className="dashboard-form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="dashboard-form-input"
                  />
                </div>
                
                <div className="dashboard-form-group">
                  <label htmlFor="lastName" className="dashboard-form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="dashboard-form-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="dashboard-profile-section">
              <h2 className="dashboard-profile-section-title">Account Details</h2>
              
              <div className="dashboard-form-group">
                <label htmlFor="username" className="dashboard-form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="dashboard-form-input"
                  required
                />
              </div>
              
              <div className="dashboard-form-group">
                <label htmlFor="email" className="dashboard-form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="dashboard-form-input"
                  required
                />
              </div>
            </div>
            
            <div className="dashboard-profile-section">
              <h2 className="dashboard-profile-section-title">Security</h2>
              
              <div className="dashboard-form-group">
                <label htmlFor="password" className="dashboard-form-label">
                  New Password <span className="dashboard-form-optional">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="dashboard-form-input"
                />
              </div>
              
              <div className="dashboard-form-group">
                <label htmlFor="confirmPassword" className="dashboard-form-label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="dashboard-form-input"
                />
              </div>
            </div>
            
            <div className="dashboard-form-actions">
              <Link to="/dashboard" className="dashboard-button dashboard-button-secondary">
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className="dashboard-button"
              >
                {loading ? (
                  <>
                    <svg className="dashboard-icon dashboard-icon-spin" viewBox="0 0 24 24">
                      <circle className="dashboard-icon-loader-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                      <path className="dashboard-icon-loader" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;