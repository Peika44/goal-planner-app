// components/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // Render the protected component
  return children;
};

export default PrivateRoute;