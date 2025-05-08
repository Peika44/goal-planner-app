import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/authApi';

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{success}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded-md`}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;