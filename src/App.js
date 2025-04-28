import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import CreateGoalPage from './pages/CreateGoalPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';

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
    return <Navigate to="/" replace />;
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
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/goals" element={
              <PrivateRoute>
                <Layout>
                  <GoalsPage />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/goals/new" element={
              <PrivateRoute>
                <Layout>
                  <CreateGoalPage />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/goals/:goalId" element={
              <PrivateRoute>
                <Layout>
                  <GoalDetailPage />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;