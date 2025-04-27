import axios from './axios';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response object
 */
export const register = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData);
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.error || 'Failed to register. Please try again.'
    };
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} Response object
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.error || 'Invalid credentials. Please try again.'
    };
  }
};

/**
 * Get the current user's data
 * @returns {Promise<Object>} Response object
 */
export const getCurrentUser = async () => {
  try {
    return await axios.get('/auth/user');
  } catch (error) {
    console.error('Get current user error:', error);
    
    // Special handling for 404 errors - likely the endpoint doesn't exist yet
    if (error.error && error.error.includes('not found')) {
      console.warn('The /auth/user endpoint might not be implemented yet');
    }
    
    return {
      success: false,
      error: error.error || 'Failed to fetch user data'
    };
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated user profile data
 * @returns {Promise<Object>} Response object
 */
export const updateProfile = async (profileData) => {
  try {
    return await axios.put('/auth/user', profileData);
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.error || 'Failed to update profile'
    };
  }
};

/**
 * Request password reset
 * @param {Object} email - User email
 * @returns {Promise<Object>} Response object
 */
export const resetPassword = async (email) => {
  try {
    return await axios.post('/auth/reset-password', { email });
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: error.error || 'Failed to send password reset email'
    };
  }
};

/**
 * Logout user by removing token
 * @returns {Object} Success status
 */
export const logout = () => {
  localStorage.removeItem('token');
  return { success: true };
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};