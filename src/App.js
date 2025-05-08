import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import CreateGoalPage from './pages/CreateGoalPage';
import ProfilePage from './pages/ProfilePage';
import LogoutPage from './pages/LogoutPage';

// Private route component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  console.log('PrivateRoute:', { loading, isAuthenticated: !!currentUser });
  
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
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected component
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/logout" element={<LogoutPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                  <DashboardPage />
              </PrivateRoute>
            } />
            
            <Route path="/goals" element={
              <PrivateRoute>
                  <GoalsPage />
              </PrivateRoute>
            } />
            
            <Route path="/goals/new" element={
              <PrivateRoute>
  
                  <CreateGoalPage />

              </PrivateRoute>
            } />
            
            <Route path="/goals/:goalId" element={
              <PrivateRoute>

                  <GoalDetailPage />
 
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>

                  <ProfilePage />

              </PrivateRoute>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;