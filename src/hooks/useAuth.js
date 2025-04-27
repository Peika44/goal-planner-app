import { useState, useEffect, createContext, useContext } from 'react';
import { getCurrentUser, logout, isLoggedIn } from '../api/authApi';

// Create authentication context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount and token change
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only attempt to get user data if a token exists
        if (isLoggedIn()) {
          const response = await getCurrentUser();
          
          if (response.success && response.user) {
            setCurrentUser(response.user);
          } else {
            // If API call fails but returns a structured error
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
          // No token found
          setCurrentUser(null);
        }
      } catch (err) {
        // This catches unexpected errors (like network issues)
        console.error('Unexpected auth check error:', err);
        setError('Authentication check failed');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Logout function
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};