// hooks/useGoals.js
import { useState, useEffect, useCallback } from 'react';
import goalApi from '../api/goalApi';
import taskApi from '../api/taskApi';

/**
 * Custom hook for managing goals
 * @returns {Object} Goal state and functions
 */
export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError('');
    
    const response = await goalApi.getAllGoals();
    
    if (response.success) {
      setGoals(response.data);
    } else {
      setError(response.error);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Only fetch if user is authenticated
    if (localStorage.getItem('token')) {
      fetchGoals();
    } else {
      setLoading(false);
    }
  }, [fetchGoals]);

  const getGoalById = async (goalId) => {
    const response = await goalApi.getGoalById(goalId);
    
    if (response.success) {
      return response.data;
    } else {
      setError(response.error);
      return null;
    }
  };

  const createGoal = async (goalData) => {
    setError('');
    
    const response = await goalApi.createGoal(goalData);
    
    if (response.success) {
      setGoals(prevGoals => [...prevGoals, response.data]);
      return response.data;
    } else {
      setError(response.error);
      return null;
    }
  };

  const updateGoal = async (goalId, goalData) => {
    setError('');
    
    const response = await goalApi.updateGoal(goalId, goalData);
    
    if (response.success) {
      setGoals(prevGoals => 
        prevGoals.map(goal => goal._id === goalId ? response.data : goal)
      );
      return response.data;
    } else {
      setError(response.error);
      return null;
    }
  };

  const deleteGoal = async (goalId) => {
    setError('');
    
    const response = await goalApi.deleteGoal(goalId);
    
    if (response.success) {
      setGoals(prevGoals => prevGoals.filter(goal => goal._id !== goalId));
      return true;
    } else {
      setError(response.error);
      return false;
    }
  };

  const completeGoal = async (goalId) => {
    setError('');
    
    const response = await goalApi.completeGoal(goalId);
    
    if (response.success) {
      setGoals(prevGoals => 
        prevGoals.map(goal => goal._id === goalId ? response.data : goal)
      );
      return response.data;
    } else {
      setError(response.error);
      return null;
    }
  };

  const generatePlan = async (goalData) => {
    setError('');
    
    const response = await goalApi.generatePlan(goalData);
    
    if (response.success) {
      return response.data;
    } else {
      setError(response.error);
      return null;
    }
  };

  const generateTasks = async (goalId, filters = {}) => {
    setError('');
    
    const response = await taskApi.generateTasks(goalId, filters);
    
    if (response.success) {
      // Update the goal with new tasks
      const updatedGoal = await getGoalById(goalId);
      if (updatedGoal) {
        setGoals(prevGoals => 
          prevGoals.map(goal => goal._id === goalId ? updatedGoal : goal)
        );
      }
      
      return response.data;
    } else {
      setError(response.error);
      return null;
    }
  };

  const completeTask = async (taskId, completed = true) => {
    setError('');
    
    const response = await taskApi.completeTask(taskId, completed);
    
    if (response.success) {
      // Find the goal containing this task and update it
      const taskData = response.data;
      
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.tasks && goal.tasks.some(task => task._id === taskId)) {
            const updatedTasks = goal.tasks.map(task => 
              task._id === taskId ? { ...task, completed } : task
            );
            
            return { ...goal, tasks: updatedTasks };
          }
          return goal;
        })
      );
      
      return taskData;
    } else {
      setError(response.error);
      return null;
    }
  };

  return {
    goals,
    loading,
    error,
    fetchGoals,
    getGoalById,
    createGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    generatePlan,
    generateTasks,
    completeTask
  };
};

export default useGoals;