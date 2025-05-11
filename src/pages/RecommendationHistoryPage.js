// RecommendationHistoryPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendationHistory } from '../api/recommendationApi';
import { useToast } from '../components/ui/Toast';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import './RecommendationHistory.css'; // You'll need to create this CSS file

const RecommendationHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'study', 'entertainment', etc.
  const toast = useToast();
  
  // Load recommendation history
  useEffect(() => {
    fetchHistory();
  }, []);
  
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getRecommendationHistory();
      
      if (response.success) {
        setHistory(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch recommendation history');
      }
    } catch (err) {
      console.error('Error fetching recommendation history:', err);
      setError('An unexpected error occurred while fetching your history');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter history based on selected category
  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.category.toLowerCase() === filter);
    
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-title-group">
          <Link to="/recommendations" className="dashboard-back-link">
            <svg className="dashboard-back-icon" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Recommendations
          </Link>
          <h1 className="dashboard-title">Activity History</h1>
        </div>
      </div>
      
      <div className="dashboard-tabs">
        <Link 
          to="/recommendations" 
          className="dashboard-tab"
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
          className="dashboard-tab dashboard-tab-active"
        >
          Activity History
        </Link>
      </div>
      
      <div className="dashboard-panel">
        {loading ? (
          <div className="dashboard-loading-center">
            <div className="dashboard-loading-spinner"></div>
            <p className="dashboard-loading-text">Loading your activity history...</p>
          </div>
        ) : error ? (
          <ErrorDisplay 
            message={error} 
            onRetry={fetchHistory}
            inline={false}
          />
        ) : (
          <div className="history-container">
            <div className="history-filters">
              <button 
                className={`history-filter-button ${filter === 'all' ? 'history-filter-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Categories
              </button>
              <button 
                className={`history-filter-button ${filter === 'study' ? 'history-filter-active' : ''}`}
                onClick={() => setFilter('study')}
              >
                Study
              </button>
              <button 
                className={`history-filter-button ${filter === 'entertainment' ? 'history-filter-active' : ''}`}
                onClick={() => setFilter('entertainment')}
              >
                Entertainment
              </button>
              <button 
                className={`history-filter-button ${filter === 'physical activity' ? 'history-filter-active' : ''}`}
                onClick={() => setFilter('physical activity')}
              >
                Physical Activity
              </button>
              <button 
                className={`history-filter-button ${filter === 'personal development' ? 'history-filter-active' : ''}`}
                onClick={() => setFilter('personal development')}
              >
                Personal Development
              </button>
              <button 
                className={`history-filter-button ${filter === 'errands' ? 'history-filter-active' : ''}`}
                onClick={() => setFilter('errands')}
              >
                Errands
              </button>
            </div>
            
            {filteredHistory.length === 0 ? (
              <div className="dashboard-empty-state">
                <svg className="dashboard-empty-state-icon" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className="dashboard-empty-state-title">
                  {filter === 'all' 
                    ? "You haven't selected any activities yet" 
                    : `You haven't selected any ${filter} activities yet`}
                </h2>
                <p className="dashboard-empty-state-message">
                  Get started by exploring recommendations and selecting activities that interest you.
                </p>
                <Link to="/recommendations" className="dashboard-button">
                  Get Recommendations
                </Link>
              </div>
            ) : (
              <div className="history-timeline">
                {filteredHistory.map((item, index) => {
                  const task = item.task;
                  
                  if (!task) return null;
                  
                  return (
                    <div key={item._id} className="history-item">
                      <div className="history-item-timeline">
                        <div className="history-item-dot"></div>
                        {index < filteredHistory.length - 1 && <div className="history-item-line"></div>}
                      </div>
                      
                      <div className="history-item-content">
                        <div className="history-item-header">
                          <span className="history-item-date">{formatDate(item.timestamp)}</span>
                          <span className={`history-item-category history-category-${item.category.toLowerCase().replace(' ', '-')}`}>
                            {item.category}
                          </span>
                        </div>
                        
                        <div className="history-item-card">
                          <h3 className="history-item-title">{task.title}</h3>
                          {task.description && (
                            <p className="history-item-description">{task.description}</p>
                          )}
                          <div className="history-item-meta">
                            <span className="history-item-badge">{task.duration} min</span>
                            {task.difficulty && (
                              <span className={`history-item-badge history-badge-${task.difficulty.toLowerCase()}`}>
                                {task.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="history-footer">
              <Link to="/recommendations" className="dashboard-button">
                Get New Recommendations
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationHistoryPage;