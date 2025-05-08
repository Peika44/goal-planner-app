import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

const LogoutPage = () => {
  const { logout } = useAuth();
  const toast = useToast();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        toast.success('You have been successfully logged out');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Failed to log out. Please try again.');
      }
    };
    
    performLogout();
  }, [logout, toast]);

  // Immediately redirect to login page
  return <Navigate to="/login" replace />;
};

export default LogoutPage;