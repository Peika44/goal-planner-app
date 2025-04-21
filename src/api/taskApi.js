// api/taskApi.js
import axios from './axios';

const taskApi = {
  getTasksByGoal: async (goalId) => {
    try {
      const response = await axios.get(`/goals/${goalId}/tasks`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch tasks' 
      };
    }
  },

  getTodayTasks: async () => {
    try {
      const response = await axios.get('/tasks/today');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch today\'s tasks' 
      };
    }
  },

  createTask: async (goalId, taskData) => {
    try {
      const response = await axios.post(`/goals/${goalId}/tasks`, taskData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create task' 
      };
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await axios.put(`/tasks/${taskId}`, taskData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update task' 
      };
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete task' 
      };
    }
  },

  completeTask: async (taskId, completed = true) => {
    try {
      const response = await axios.patch(`/tasks/${taskId}`, { completed });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update task status' 
      };
    }
  },

  generateTasks: async (goalId, filters = {}) => {
    try {
      const response = await axios.post(`/goals/${goalId}/generate-tasks`, filters);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to generate tasks' 
      };
    }
  },
};

export default taskApi;