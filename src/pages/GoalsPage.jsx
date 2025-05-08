import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGoals, deleteGoal, completeGoal } from '../api/goalApi';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAllGoals();
        
        if (response.success) {
          setGoals(response.data);
        } else {
          setError(response.error || 'Failed to fetch goals');
          setGoals([]);
        }
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('An unexpected error occurred. Please try again.');
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Filter and search goals
  useEffect(() => {
    let result = [...goals];
    
    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(goal => 
        filter === 'completed' ? goal.isCompleted : 
        filter === 'active' ? !goal.isCompleted :
        goal.category === filter
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(goal =>
        goal.title.toLowerCase().includes(term) ||
        goal.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredGoals(result);
  }, [goals, filter, searchTerm]);

  // Handle goal deletion
  const handleDeleteGoal = async (goalId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        const response = await deleteGoal(goalId);
        
        if (response.success) {
          setGoals(goals.filter(goal => goal._id !== goalId));
        } else {
          setError(response.error || 'Failed to delete goal');
        }
      } catch (err) {
        console.error('Delete goal error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  // Handle goal completion
  const handleCompleteGoal = async (goalId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await completeGoal(goalId);
      
      if (response.success) {
        setGoals(goals.map(goal => 
          goal._id === goalId ? response.data : goal
        ));
      } else {
        setError(response.error || 'Failed to complete goal');
      }
    } catch (err) {
      console.error('Complete goal error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-title-group">
          <Link to="/dashboard" className="dashboard-back-link">
            <svg className="dashboard-back-icon" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Dashboard</span>
          </Link>
          <h1 className="dashboard-title">My Goals</h1>
        </div>
        <Link
          to="/goals/new"
          className="dashboard-button"
        >
          <svg className="dashboard-icon" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
          </svg>
          New Goal
        </Link>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="dashboard-alert dashboard-alert-error">
          <div className="dashboard-alert-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7v-2h2v2h-2zm0-8v4h2V7h-2z" />
            </svg>
          </div>
          <div className="dashboard-alert-content">
            <h3 className="dashboard-alert-title">{error}</h3>
          </div>
        </div>
      )}
      
      {/* Filters and search */}
      <div className="dashboard-panel dashboard-filters-panel">
        <div className="dashboard-filters">
          <div className="dashboard-filter-group">
            <label htmlFor="filter" className="dashboard-filter-label">
              Filter by:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="dashboard-form-select"
            >
              <option value="all">All Goals</option>
              <option value="active">Active Goals</option>
              <option value="completed">Completed Goals</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
              <option value="Health">Health</option>
              <option value="Financial">Financial</option>
              <option value="Educational">Educational</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="dashboard-filter-group">
            <label htmlFor="search" className="dashboard-filter-label">
              Search goals:
            </label>
            <div className="dashboard-search-input-wrapper">
              <svg className="dashboard-search-icon" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description"
                className="dashboard-search-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="dashboard-search-clear"
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" className="dashboard-search-clear-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Goals list */}
      <div className="dashboard-panel dashboard-goals-panel">
        {loading ? (
          <div className="dashboard-loading-center">
            <div className="dashboard-loading-spinner"></div>
            <p className="dashboard-loading-text">Loading goals...</p>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="dashboard-empty-state">
            <svg className="dashboard-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="dashboard-empty-state-title">
              {searchTerm
                ? 'No goals match your search criteria'
                : filter !== 'all'
                ? 'No goals match the selected filter'
                : 'You have not created any goals yet'}
            </h3>
            <p className="dashboard-empty-state-message">
              {searchTerm || filter !== 'all' 
                ? 'Try changing your filters or create a new goal'
                : 'Goals help you organize your tasks and track your progress'}
            </p>
            <Link
              to="/goals/new"
              className="dashboard-button dashboard-button-small"
            >
              <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
              </svg>
              Create your first goal
            </Link>
          </div>
        ) : (
          <ul className="dashboard-goals-list">
            {filteredGoals.map(goal => (
              <li key={goal._id} className="dashboard-goals-list-item">
                <Link to={`/goals/${goal._id}`} className="dashboard-goal-link">
                  <div className="dashboard-goal-card-content">
                    <div className="dashboard-goal-main">
                      <div className="dashboard-goal-header">
                        <h3 className={`dashboard-goal-title ${goal.isCompleted ? 'dashboard-goal-title-completed' : ''}`}>
                          {goal.title}
                        </h3>
                        <div className="dashboard-goal-badges">
                          <span className={`dashboard-badge ${
                            goal.category === 'Personal' ? 'dashboard-badge-purple' :
                            goal.category === 'Professional' ? 'dashboard-badge-blue' :
                            goal.category === 'Health' ? 'dashboard-badge-green' :
                            goal.category === 'Financial' ? 'dashboard-badge-yellow' :
                            'dashboard-badge-gray'
                          }`}>
                            {goal.category}
                          </span>
                          {goal.isCompleted && (
                            <span className="dashboard-badge dashboard-badge-green">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="dashboard-goal-description">
                        {goal.description}
                      </p>
                      
                      <div className="dashboard-goal-info">
                        <span className="dashboard-goal-date">Target: {formatDate(goal.targetDate)}</span>
                        <span className="dashboard-goal-separator">•</span>
                        <span className={`dashboard-goal-priority dashboard-goal-priority-${goal.priority.toLowerCase()}`}>
                          {goal.priority} Priority
                        </span>
                      </div>
                    </div>
                    
                    <div className="dashboard-goal-side">
                      <div className="dashboard-goal-progress-container">
                        <div className="dashboard-progress-bar">
                          <div 
                            className="dashboard-progress-value" 
                            style={{ width: `${goal.progress}%` }} 
                          ></div>
                        </div>
                        <span className="dashboard-progress-text">{goal.progress}%</span>
                      </div>
                      
                      <div className="dashboard-goal-actions">
                        {!goal.isCompleted && (
                          <button
                            onClick={(e) => handleCompleteGoal(goal._id, e)}
                            className="dashboard-goal-action-button dashboard-goal-complete-button"
                            title="Mark as complete"
                          >
                            <svg className="dashboard-goal-action-icon" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => handleDeleteGoal(goal._id, e)}
                          className="dashboard-goal-action-button dashboard-goal-delete-button"
                          title="Delete goal"
                        >
                          <svg className="dashboard-goal-action-icon" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;