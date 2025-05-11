// src/api/recommendationApi.js
import axios from './axios';

/**
 * Get personalized activity recommendations
 * @param {Object} filters - Optional filters to customize recommendations
 * @returns {Promise<Object>} Response with recommendations
 */
export const getRecommendations = async (filters = {}) => {
  try {
    // Convert filters object to query params
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/recommendations${queryString ? `?${queryString}` : ''}`;
    
    return await axios.get(endpoint);
  } catch (error) {
    console.error('Get recommendations error:', error);
    // Return a consistent error format
    return error.success === false ? error : {
      success: false,
      error: error.message || 'Failed to fetch recommendations'
    };
  }
};

/**
 * Save user's selection of recommendations
 * @param {Object} selections - Object containing the selected recommendations
 * @returns {Promise<Object>} Response object
 */
export const saveUserSelection = async (selections) => {
  try {
    return await axios.post('/recommendations/selections', { selections });
  } catch (error) {
    console.error('Save selection error:', error);
    return error.success === false ? error : {
      success: false,
      error: error.message || 'Failed to save your selections'
    };
  }
};

/**
 * Provide feedback on a recommendation
 * @param {string} recommendationId - ID of the recommendation
 * @param {Object} feedback - Feedback data (rating, comments, etc.)
 * @returns {Promise<Object>} Response object
 */
export const provideFeedback = async (recommendationId, feedback) => {
  try {
    return await axios.post(`/recommendations/${recommendationId}/feedback`, feedback);
  } catch (error) {
    console.error('Provide feedback error:', error);
    return error.success === false ? error : {
      success: false,
      error: error.message || 'Failed to submit feedback'
    };
  }
};

/**
 * Get user's recommendation preferences
 * @returns {Promise<Object>} Response with preferences
 */
export const getPreferences = async () => {
  try {
    return await axios.get('/recommendations/preferences');
  } catch (error) {
    console.error('Get preferences error:', error);
    return error.success === false ? error : {
      success: false,
      error: error.message || 'Failed to fetch preferences'
    };
  }
};

/**
 * Update user's recommendation preferences
 * @param {Object} preferencesData - Updated preferences data
 * @returns {Promise<Object>} Response object
 */
export const updatePreferences = async (preferencesData) => {
  try {
    return await axios.put('/recommendations/preferences', preferencesData);
  } catch (error) {
    console.error('Update preferences error:', error);
    return error.success === false ? error : {
      success: false,
      error: error.message || 'Failed to update preferences'
    };
  }
};

/**
 * Get user's activity history
 * @returns {Promise<Object>} Response with activity history
 */
export const getActivityHistory = async () => {
  try {
    return await axios.get('/recommendations/history');
  } catch (error) {
    console.error('Get activity history error:', error);
    return error.success === false ? error : {
      success: false,
      error: error.message || 'Failed to fetch activity history'
    };
  }
};

/**
 * Get recommendation history (alias for getActivityHistory for backward compatibility)
 * @returns {Promise<Object>} Response with recommendation history
 */
export const getRecommendationHistory = async () => {
  return getActivityHistory();
};

/**
 * Add selected tasks to user's task list
 * @param {Array} tasks - Array of task objects to add
 * @returns {Promise<Object>} Response object
 */
export const addToTasks = async (tasks) => {
  try {
    return await axios.post('/tasks', { tasks });
  } catch (error) {
    console.error('Add to tasks error:', error);
    return error.success === false ? error : {
      success: false,
      error: error.message || 'Failed to add tasks'
    };
  }
};

/**
 * Mark a task as completed
 * @param {string} taskId - ID of the task to mark as completed
 * @returns {Promise<Object>} Response object
 */
export const completeTask = async (taskId) => {
  try {
    return await axios.put(`/tasks/${taskId}/complete`);
  } catch (error) {
    console.error('Complete task error:', error);
    return error.success === false ? error : {
      success: false,
      error: error.message || 'Failed to mark task as completed'
    };
  }
};