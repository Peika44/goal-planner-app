// RecommendationDashboardPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RecommendationEngine from '../components/RecommendationEngine';
import { useToast } from '../components/ui/Toast';
import './RecommendationDashboard.css'; // You'll need to create this CSS file

const RecommendationDashboardPage = () => {
  const [selectedTasks, setSelectedTasks] = useState({});
  const toast = useToast();
  
  const handleTasksSelected = (tasks) => {
    setSelectedTasks(tasks);
    toast.success('Tasks selected successfully!');
  };
  
  const handleAddToTasks = async () => {
    try {
      // Logic to add selected tasks to the user's task list would go here
      toast.success('Tasks added to your list!');
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error('Failed to add tasks: ' + error.message);
    }
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-title-group">
          <Link to="/dashboard" className="dashboard-back-link">
            <svg className="dashboard-back-icon" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="dashboard-title">Activity Recommendations</h1>
        </div>
        
        {Object.keys(selectedTasks).length > 0 && (
          <div className="dashboard-header-actions">
            <button
              onClick={handleAddToTasks}
              className="dashboard-button"
            >
              <svg className="dashboard-icon" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add to My Tasks
            </button>
          </div>
        )}
      </div>
      
      <div className="dashboard-tabs">
        <Link 
          to="/recommendations" 
          className="dashboard-tab dashboard-tab-active"
        >
          Get Recommendations
        </Link>
        <Link 
          to="/recommendations/preferences" 
          className="dashboard-tab"
        >
          My Preferences
        </Link>
        <Link 
          to="/recommendations/history" 
          className="dashboard-tab"
        >
          Activity History
        </Link>
      </div>
      
      <div className="dashboard-panel">
        <div className="recommendation-dashboard-content">
          <RecommendationEngine onTasksSelected={handleTasksSelected} />
        </div>
      </div>
    </div>
  );
};

export default RecommendationDashboardPage;