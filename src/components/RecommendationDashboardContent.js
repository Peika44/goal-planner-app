// src/components/RecommendationDashboardContent.js
import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../api/recommendationApi';

const RecommendationDashboardContent = ({ onTasksSelected }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Use a simple set of filters for initial load
        const response = await getRecommendations({
          mood: 'Neutral',
          energyLevel: 'Medium',
          timeAvailable: 30
        });

        if (response && response.recommendedTasks) {
          setRecommendations(response.recommendedTasks);
          setError(null);
        } else {
          setError('Unable to load recommendations');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleTaskSelection = (task) => {
    if (onTasksSelected) {
      onTasksSelected({ [task.id]: task });
    }
  };

  if (loading) {
    return (
      <div className="recommendation-loading">
        <div className="recommendation-loading-spinner"></div>
        <p>Loading your personalized recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendation-empty">
        <h3>No Recommendations Available</h3>
        <p>We couldn't find any recommendations matching your preferences. Please adjust your settings or try again later.</p>
      </div>
    );
  }

  return (
    <div className="recommendation-content">
      <h3 className="recommendation-section-title">Today's Recommended Activities</h3>
      <p className="recommendation-section-description">
        These activities are tailored to your preferences and current state.
      </p>
      
      <div className="recommendation-card-grid">
        {recommendations.map(task => (
          <div 
            key={task.id} 
            className="recommendation-card"
            onClick={() => handleTaskSelection(task)}
          >
            <div className="recommendation-card-header">
              <span className={`recommendation-card-category recommendation-category-${task.category.toLowerCase()}`}>
                {task.category}
              </span>
              <span className="recommendation-card-duration">{task.duration} min</span>
            </div>
            
            <h4 className="recommendation-card-title">{task.title}</h4>
            <p className="recommendation-card-description">{task.description}</p>
            
            <div className="recommendation-card-footer">
              <span className={`recommendation-difficulty recommendation-difficulty-${task.difficulty.toLowerCase()}`}>
                {task.difficulty}
              </span>
              <button className="recommendation-card-button">Select</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationDashboardContent;