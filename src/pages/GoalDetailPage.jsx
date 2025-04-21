// pages/GoalDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import MilestonesList from '../components/goals/MilestonesList';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import axios from '../api/axios';

const GoalDetailPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    duration: '',
    status: ''
  });

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const response = await axios.get(`/goals/${goalId}`);
        setGoal(response.data);
        setTasks(response.data.tasks || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching goal details', err);
        setError('Failed to load goal details');
        setLoading(false);
      }
    };

    fetchGoalDetails();
  }, [goalId]);

  const handleTaskComplete = async (taskId, completed) => {
    try {
      await axios.patch(`/tasks/${taskId}`, { completed });
      
      // Update local state
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, completed } : task
      ));
      
      // Update goal progress if needed
      setGoal(prevGoal => {
        const updatedTasks = prevGoal.tasks.map(task => 
          task._id === taskId ? { ...task, completed } : task
        );
        
        return { ...prevGoal, tasks: updatedTasks };
      });
    } catch (err) {
      console.error('Error updating task status', err);
    }
  };

  const handleRegenerateTasks = async () => {
    try {
      const response = await axios.post(`/goals/${goalId}/regenerate-tasks`, filters);
      setTasks(response.data);
    } catch (err) {
      console.error('Error regenerating tasks', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Goal not found'}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{goal.name}</h1>
              <p className="text-gray-600 mt-1">{goal.description}</p>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  {goal.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {goal.timeframe}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">{progressPercentage}% Complete</span>
                <span className="text-xs text-gray-500">({completedTasks}/{totalTasks} tasks)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestones - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Milestones</h2>
              <MilestonesList milestones={goal.plan?.milestones || []} />
            </div>
          </div>

          {/* Tasks - Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
                <button 
                  onClick={handleRegenerateTasks}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Regenerate Tasks
                </button>
              </div>
              
              <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
              
              <TaskList 
                tasks={tasks} 
                onTaskComplete={handleTaskComplete} 
                filters={filters}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetailPage;