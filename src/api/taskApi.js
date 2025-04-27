import axios from './axios';

/**
 * Get tasks for a specific goal
 * @param {string} goalId - The ID of the goal
 * @returns {Promise<Object>} Response with tasks data
 */
export const getTasksByGoal = async (goalId) => {
  try {
    return await axios.get(`/goals/${goalId}/tasks`);
  } catch (error) {
    console.error(`Get tasks for goal ${goalId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to fetch tasks',
      data: [] // Return empty array as fallback
    };
  }
};

/**
 * Get tasks scheduled for today
 * @returns {Promise<Object>} Response with today's tasks
 */
export const getTodayTasks = async () => {
  try {
    return await axios.get('/tasks/today');
  } catch (error) {
    console.error('Get today tasks error:', error);
    return {
      success: false,
      error: error.error || 'Failed to fetch today\'s tasks',
      data: [] // Return empty array as fallback
    };
  }
};

/**
 * Create a new task for a goal
 * @param {string} goalId - The ID of the goal
 * @param {Object} taskData - The task data to create
 * @returns {Promise<Object>} Response with created task
 */
export const createTask = async (goalId, taskData) => {
  try {
    return await axios.post(`/goals/${goalId}/tasks`, taskData);
  } catch (error) {
    console.error('Create task error:', error);
    return {
      success: false,
      error: error.error || 'Failed to create task'
    };
  }
};

/**
 * Update an existing task
 * @param {string} taskId - The ID of the task to update
 * @param {Object} taskData - The updated task data
 * @returns {Promise<Object>} Response with updated task
 */
export const updateTask = async (taskId, taskData) => {
  try {
    return await axios.put(`/tasks/${taskId}`, taskData);
  } catch (error) {
    console.error(`Update task ${taskId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to update task'
    };
  }
};

/**
 * Delete a task
 * @param {string} taskId - The ID of the task to delete
 * @returns {Promise<Object>} Response indicating success/failure
 */
export const deleteTask = async (taskId) => {
  try {
    return await axios.delete(`/tasks/${taskId}`);
  } catch (error) {
    console.error(`Delete task ${taskId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to delete task'
    };
  }
};

/**
 * Toggle task completion status
 * @param {string} taskId - The ID of the task to toggle
 * @returns {Promise<Object>} Response with updated task
 */
export const completeTask = async (taskId) => {
  try {
    return await axios.patch(`/tasks/${taskId}`);
  } catch (error) {
    console.error(`Complete task ${taskId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to update task completion status'
    };
  }
};

/**
 * Generate tasks for a goal using AI
 * @param {string} goalId - The ID of the goal
 * @returns {Promise<Object>} Response with generated tasks
 */
export const generateTasks = async (goalId) => {
  try {
    return await axios.post(`/goals/${goalId}/generate-tasks`);
  } catch (error) {
    console.error(`Generate tasks for goal ${goalId} error:`, error);
    return {
      success: false,
      error: error.error || 'Failed to generate tasks'
    };
  }
};

/**
 * Fetch today's tasks - alias for getTodayTasks for backward compatibility
 */
export const fetchTodaysTasks = getTodayTasks;

// Default export for backward compatibility
const taskApi = {
  getTasksByGoal,
  getTodayTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  generateTasks,
  fetchTodaysTasks
};

export default taskApi;