// api/goalApi.js
import axios from './axios';

const goalApi = {
  getAllGoals: async () => {
    try {
      const response = await axios.get('/goals');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch goals' 
      };
    }
  },

  getGoalById: async (goalId) => {
    try {
      const response = await axios.get(`/goals/${goalId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch goal details' 
      };
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await axios.post('/goals', goalData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create goal' 
      };
    }
  },

  updateGoal: async (goalId, goalData) => {
    try {
      const response = await axios.put(`/goals/${goalId}`, goalData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update goal' 
      };
    }
  },

  deleteGoal: async (goalId) => {
    try {
      await axios.delete(`/goals/${goalId}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete goal' 
      };
    }
  },

  completeGoal: async (goalId) => {
    try {
      const response = await axios.patch(`/goals/${goalId}/complete`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to mark goal as complete' 
      };
    }
  },

  generatePlan: async (goalData) => {
    try {
      const response = await axios.post('/goals/generate-plan', goalData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to generate AI plan' 
      };
    }
  },
};

export default goalApi;