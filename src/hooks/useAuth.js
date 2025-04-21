// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

/**
 * Custom hook for authentication state and operations
 * @returns {Object} Auth state and functions
 */
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await authApi.getCurrentUser();
      
      if (response.success) {
        setCurrentUser(response.data);
      } else {
        // Clear token if invalid
        localStorage.removeItem('token');
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setError('');
    setLoading(true);
    
    const response = await authApi.login(email, password);
    
    setLoading(false);
    
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      navigate('/dashboard');
      return true;
    } else {
      setError(response.error);
      return false;
    }
  };

  const register = async (email, password) => {
    setError('');
    setLoading(true);
    
    const response = await authApi.register(email, password);
    
    setLoading(false);
    
    if (response.success) {
      return true;
    } else {
      setError(response.error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  const updateProfile = async (userData) => {
    setError('');
    setLoading(true);
    
    const response = await authApi.updateProfile(userData);
    
    setLoading(false);
    
    if (response.success) {
      setCurrentUser(response.data);
      return true;
    } else {
      setError(response.error);
      return false;
    }
  };

  const resetPassword = async (email) => {
    setError('');
    setLoading(true);
    
    const response = await authApi.requestPasswordReset(email);
    
    setLoading(false);
    
    if (response.success) {
      return true;
    } else {
      setError(response.error);
      return false;
    }
  };

  return {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    isAuthenticated: !!currentUser
  };
};

export default useAuth;