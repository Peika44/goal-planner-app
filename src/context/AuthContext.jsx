import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logout, isLoggedIn } from '../api/authApi';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check auth status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Only attempt to get user data if a token exists
      if (isLoggedIn()) {
        console.log('Token exists, checking user data...');
        const response = await getCurrentUser();
        
        console.log('Auth check response:', response);
        
        if (response.success && response.user) {
          setCurrentUser(response.user);
        } else {
          console.error('Auth check failed:', response.error);
          setError(response.error);
          setCurrentUser(null);
          
          // If the error is authentication-related, clear the token
          if (response.error && 
              (response.error.includes('not authorized') || 
                response.error.includes('token') || 
                response.error.includes('authentication'))) {
            logout();
          }
        }
      } else {
        console.log('No token found, user is not logged in');
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Unexpected auth check error:', err);
      setError('Authentication check failed');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    console.log('AuthProvider mounted, checking auth status...');
    checkAuthStatus();
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    setCurrentUser,
    logout: handleLogout,
    isAuthenticated: !!currentUser,
    checkAuthStatus // Expose this to manually refresh auth status
  };

  console.log('AuthContext state:', { loading, isAuthenticated: !!currentUser });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;