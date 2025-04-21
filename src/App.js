// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoalProvider } from './context/GoalContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import NewGoalPage from './pages/NewGoalPage';
import GoalDetailPage from './pages/GoalDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <GoalProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/goals" 
              element={
                <PrivateRoute>
                  <GoalsPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/goals/new" 
              element={
                <PrivateRoute>
                  <NewGoalPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/goals/:goalId" 
              element={
                <PrivateRoute>
                  <GoalDetailPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />
            
            {/* Catch-all for 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
        </GoalProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;