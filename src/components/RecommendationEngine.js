// src/components/RecommendationEngine.js
import React, { useState, useEffect, useRef } from 'react';
import { getRecommendations } from '../api/recommendationApi';
import { useToast } from '../components/ui/Toast';

const RecommendationEngine = ({ onTasksSelected }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    duration: 'all',
    mood: 'Neutral',
    energyLevel: 'Medium',
    timeAvailable: 30
  });
  
  // Use refs to track component mounted state and prevent state updates after unmount
  const isMounted = useRef(true);
  const toast = useToast();
  
  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch recommendations on component mount
  useEffect(() => {
    // Cancel any in-flight requests when filters change or component unmounts
    const controller = new AbortController();
    
    const fetchRecommendations = async () => {
      if (!isMounted.current) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getRecommendations(filters);
        
        // Check if component is still mounted before updating state
        if (isMounted.current) {
          if (response.success) {
            setRecommendations(response.recommendedTasks || []);
          } else {
            setError(response.error || 'Failed to load recommendations');
            toast.error(response.error || 'Failed to load recommendations');
          }
        }
      } catch (err) {
        // Only update state if component is still mounted
        if (isMounted.current) {
          console.error('Error fetching recommendations:', err);
          setError('Failed to load recommendations. Please try again.');
          toast.error('Failed to load recommendations');
        }
      } finally {
        // Only update state if component is still mounted
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    // Execute the fetch function
    fetchRecommendations();
    
    // Cleanup function to abort any pending requests
    return () => {
      controller.abort();
    };
  }, [filters, toast]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    // The filters are already applied via the useEffect hook that depends on filters
  };

  // Toggle task selection
  const toggleTaskSelection = (task) => {
    if (!isMounted.current) return;
    
    setSelectedTasks(prev => {
      const newSelected = { ...prev };
      
      if (newSelected[task.id]) {
        delete newSelected[task.id];
      } else {
        newSelected[task.id] = task;
      }
      
      // Notify parent component about selection changes
      onTasksSelected(newSelected);
      
      return newSelected;
    });
  };

  // Refresh recommendations
  const handleRefresh = () => {
    if (!isMounted.current) return;
    
    // Using a new object reference forces the useEffect to run again
    setFilters(prev => ({ ...prev }));
    toast.success('Refreshing recommendations...');
  };

  // If component is unmounted, return null to prevent any rendering
  if (!isMounted.current) return null;

  return (
    <div className="recommendation-container">
      <div className="recommendation-header">
        <div>
          <h2 className="recommendation-title">Daily Recommendations</h2>
          <p className="recommendation-subtitle">Personalized activities to boost your day</p>
        </div>
        <button 
          className="recommendation-refresh-button" 
          onClick={handleRefresh}
          disabled={loading}
        >
          <svg 
            className={`recommendation-icon ${loading ? 'recommendation-icon-spin' : ''}`} 
            viewBox="0 0 24 24"
          >
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <form className="recommendation-inputs" onSubmit={applyFilters}>
        <div className="recommendation-input-group">
          <label className="recommendation-label" htmlFor="category">
            Category
          </label>
          <div className="recommendation-select-wrapper">
            <select
              id="category"
              name="category"
              className="recommendation-select"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">All Categories</option>
              <option value="Wellness">Wellness</option>
              <option value="Fitness">Fitness</option>
              <option value="Learning">Learning</option>
              <option value="Creativity">Creativity</option>
              <option value="Productivity">Productivity</option>
            </select>
          </div>
        </div>

        <div className="recommendation-input-group">
          <label className="recommendation-label" htmlFor="difficulty">
            Difficulty
          </label>
          <div className="recommendation-select-wrapper">
            <select
              id="difficulty"
              name="difficulty"
              className="recommendation-select"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="all">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="recommendation-input-group">
          <label className="recommendation-label" htmlFor="duration">
            Duration
          </label>
          <div className="recommendation-select-wrapper">
            <select
              id="duration"
              name="duration"
              className="recommendation-select"
              value={filters.duration}
              onChange={handleFilterChange}
            >
              <option value="all">Any Duration</option>
              <option value="short">Short (5-15 min)</option>
              <option value="medium">Medium (15-30 min)</option>
              <option value="long">Long (30+ min)</option>
            </select>
          </div>
        </div>

        <div className="recommendation-input-group">
          <label className="recommendation-label" htmlFor="mood">
            Mood
          </label>
          <div className="recommendation-select-wrapper">
            <select
              id="mood"
              name="mood"
              className="recommendation-select"
              value={filters.mood}
              onChange={handleFilterChange}
            >
              <option value="all">Any Mood</option>
              <option value="Calm">Calm</option>
              <option value="Focused">Focused</option>
              <option value="Energetic">Energetic</option>
              <option value="Neutral">Neutral</option>
              <option value="Reflective">Reflective</option>
            </select>
          </div>
        </div>

        <div className="recommendation-input-group">
          <label className="recommendation-label" htmlFor="energyLevel">
            Energy Level
          </label>
          <div className="recommendation-select-wrapper">
            <select
              id="energyLevel"
              name="energyLevel"
              className="recommendation-select"
              value={filters.energyLevel}
              onChange={handleFilterChange}
            >
              <option value="all">Any Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="recommendation-input-group">
          <label className="recommendation-label" htmlFor="timeAvailable">
            Time Available (minutes)
          </label>
          <div className="recommendation-select-wrapper">
            <select
              id="timeAvailable"
              name="timeAvailable"
              className="recommendation-select"
              value={filters.timeAvailable}
              onChange={handleFilterChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>
        </div>

        <div className="recommendation-input-group">
          <label className="recommendation-label" style={{ visibility: 'hidden' }}>
            Apply
          </label>
          <button 
            type="submit" 
            className="recommendation-filter-button"
            disabled={loading}
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="recommendation-error">
          <p>{error}</p>
          <button onClick={() => setFilters(prev => ({ ...prev }))}>Try Again</button>
        </div>
      )}

      {/* Recommendations cards */}
      {loading ? (
        <div className="recommendation-loading">
          <div className="recommendation-loading-spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="recommendation-empty">
          <p>No recommendations found for your criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="recommendation-grid">
          {recommendations.map(task => (
            <div 
              key={task.id} 
              className={`recommendation-card ${selectedTasks[task.id] ? 'recommendation-card-selected' : ''}`}
              onClick={() => toggleTaskSelection(task)}
            >
              <div className="recommendation-card-header">
                <div className={`recommendation-card-category recommendation-category-${task.category.toLowerCase()}`}>
                  {task.category}
                </div>
                <div className="recommendation-card-duration">
                  {task.duration} min
                </div>
              </div>
              <h3 className="recommendation-card-title">{task.title}</h3>
              <p className="recommendation-card-description">{task.description}</p>
              <div className="recommendation-card-benefits">
                <h4>Benefits:</h4>
                <ul>
                  {task.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="recommendation-card-footer">
                <div className={`recommendation-difficulty recommendation-difficulty-${task.difficulty.toLowerCase()}`}>
                  {task.difficulty}
                </div>
                <div className="recommendation-card-select">
                  {selectedTasks[task.id] ? (
                    <svg className="recommendation-icon-check" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    'Select'
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationEngine;