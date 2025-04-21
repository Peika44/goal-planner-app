// api/authApi.js
import axios from './axios';

const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'An error occurred during login' 
      };
    }
  },

  register: async (email, password) => {
    try {
      const response = await axios.post('/auth/register', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'An error occurred during registration' 
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get('/auth/user');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get current user' 
      };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axios.put('/auth/user', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post('/auth/reset-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to request password reset' 
      };
    }
  },
};

export default authApi;