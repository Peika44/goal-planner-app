import axios from './axios';

/**
 * Get all goals for the current user
 * @returns {Promise<Object>} Response with goals data
 */
export const getAllGoals = async () => {
  try {
    return await axios.get('/goals');
  } catch (error) {
    console.error('Get all goals error:', error);
    return {
      success: false,
      error: error.error || 'Failed to fetch goals',
      data: [] // Return empty array as fallback
    };
  }
};

/**
 * Get a specific goal by ID
 * @param {string} goalId - The ID of the goal to fetch
 * @returns {Promise<Object>} Response with goal data
 */
export const getGoalById = async (goalId) => {
  try {
    return await axios.get(`/goals/${goalId}`);
  } catch (error) {
    console.error(`Get goal ${goalId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to fetch goal details'
    };
  }
};

/**
 * Create a new goal
 * @param {Object} goalData - The goal data to create
 * @returns {Promise<Object>} Response with created goal
 */
export const createGoal = async (goalData) => {
  try {
    return await axios.post('/goals', goalData);
  } catch (error) {
    console.error('Create goal error:', error);
    return {
      success: false,
      error: error.error || 'Failed to create goal'
    };
  }
};

/**
 * Update an existing goal
 * @param {string} goalId - The ID of the goal to update
 * @param {Object} goalData - The updated goal data
 * @returns {Promise<Object>} Response with updated goal
 */
export const updateGoal = async (goalId, goalData) => {
  try {
    return await axios.put(`/goals/${goalId}`, goalData);
  } catch (error) {
    console.error(`Update goal ${goalId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to update goal'
    };
  }
};

/**
 * Delete a goal
 * @param {string} goalId - The ID of the goal to delete
 * @returns {Promise<Object>} Response indicating success/failure
 */
export const deleteGoal = async (goalId) => {
  try {
    return await axios.delete(`/goals/${goalId}`);
  } catch (error) {
    console.error(`Delete goal ${goalId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to delete goal'
    };
  }
};

/**
 * Mark a goal as complete
 * @param {string} goalId - The ID of the goal to complete
 * @returns {Promise<Object>} Response with updated goal
 */
export const completeGoal = async (goalId) => {
  try {
    return await axios.patch(`/goals/${goalId}/complete`);
  } catch (error) {
    console.error(`Complete goal ${goalId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to complete goal'
    };
  }
};

/**
 * Generate an AI plan for a goal
 * @param {Object} goalData - The goal data to create a plan for
 * @returns {Promise<Object>} Response with AI-generated plan
 */
export const generatePlan = async (goalData) => {
  try {
    return await axios.post('/goals/generate-plan', goalData);
  } catch (error) {
    console.error('Generate plan error:', error);
    return {
      success: false,
      error: error.error || 'Failed to generate goal plan'
    };
  }
};

/**
 * Fetch goals - alias for getAllGoals for backward compatibility
 */
export const fetchGoals = getAllGoals;

/**
 * Refresh goals - alias for getAllGoals for backward compatibility
 */
export const refreshGoals = getAllGoals;

// Default export for backward compatibility
const goalApi = {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  generatePlan,
  fetchGoals,
  refreshGoals
};

export default goalApi;