// context/GoalContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';

const GoalContext = createContext();

export const useGoals = () => useContext(GoalContext);

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('/goals');
        setGoals(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching goals', err);
        setError('Failed to load goals');
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated (token exists)
    if (localStorage.getItem('token')) {
      fetchGoals();
    } else {
      setLoading(false);
    }
  }, []);

  const createGoal = async (goalData) => {
    try {
      const response = await axios.post('/goals', goalData);
      setGoals(prevGoals => [...prevGoals, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating goal', err);
      setError(err.response?.data?.message || 'Failed to create goal');
      throw err;
    }
  };

  const updateGoal = async (goalId, updatedData) => {
    try {
      const response = await axios.put(`/goals/${goalId}`, updatedData);
      setGoals(prevGoals => 
        prevGoals.map(goal => goal._id === goalId ? response.data : goal)
      );
      return response.data;
    } catch (err) {
      console.error('Error updating goal', err);
      setError(err.response?.data?.message || 'Failed to update goal');
      throw err;
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await axios.delete(`/goals/${goalId}`);
      setGoals(prevGoals => prevGoals.filter(goal => goal._id !== goalId));
    } catch (err) {
      console.error('Error deleting goal', err);
      setError(err.response?.data?.message || 'Failed to delete goal');
      throw err;
    }
  };

  const completeGoal = async (goalId) => {
    try {
      const response = await axios.patch(`/goals/${goalId}/complete`);
      setGoals(prevGoals => 
        prevGoals.map(goal => goal._id === goalId ? response.data : goal)
      );
      return response.data;
    } catch (err) {
      console.error('Error completing goal', err);
      setError(err.response?.data?.message || 'Failed to complete goal');
      throw err;
    }
  };

  const generateTasks = async (goalId, filters = {}) => {
    try {
      const response = await axios.post(`/goals/${goalId}/generate-tasks`, filters);
      // Update the goal with new tasks
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === goalId 
            ? { ...goal, tasks: response.data } 
            : goal
        )
      );
      return response.data;
    } catch (err) {
      console.error('Error generating tasks', err);
      setError(err.response?.data?.message || 'Failed to generate tasks');
      throw err;
    }
  };

  const value = {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    generateTasks,
    refreshGoals: async () => {
      setLoading(true);
      try {
        const response = await axios.get('/goals');
        setGoals(response.data);
      } catch (err) {
        console.error('Error refreshing goals', err);
        setError(err.response?.data?.message || 'Failed to refresh goals');
      } finally {
        setLoading(false);
      }
    }
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};