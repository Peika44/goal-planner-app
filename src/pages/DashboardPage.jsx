import React, { useState, useEffect } from 'react';
import { getAllGoals } from '../api/goalApi';
import { getTodayTasks } from '../api/taskApi';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import TodayTasks from '../components/dashboard/TodayTasks';
import RecentGoals from '../components/dashboard/RecentGoals';

const DashboardPage = () => {
  const [goals, setGoals] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('DashboardPage: Fetching data...');
      try {
        setLoading(true);
        
        // Fetch goals
        console.log('DashboardPage: Fetching goals...');
        const goalsResponse = await getAllGoals();
        console.log('Goals response:', goalsResponse);
        
        if (goalsResponse.success) {
          setGoals(goalsResponse.data || []);
          console.log('Goals data set:', goalsResponse.data);
        } else {
          console.error('Failed to fetch goals:', goalsResponse.error);
          setError('Failed to fetch goals');
          // Set empty array as fallback
          setGoals([]);
        }
        
        // Fetch today's tasks
        console.log('DashboardPage: Fetching tasks...');
        const tasksResponse = await getTodayTasks();
        console.log('Tasks response:', tasksResponse);
        
        if (tasksResponse.success) {
          setTodayTasks(tasksResponse.data || []);
          console.log('Tasks data set:', tasksResponse.data);
        } else {
          console.error('Failed to fetch today\'s tasks:', tasksResponse.error);
          // Still set empty array as fallback
          setTodayTasks([]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error loading dashboard data. Please try again later.');
        // Set empty arrays as fallback
        setGoals([]);
        setTodayTasks([]);
      } finally {
        setLoading(false);
        console.log('DashboardPage: Loading complete');
      }
    };

    fetchDashboardData();
  }, []);

  console.log('DashboardPage render state:', { loading, error, goalsCount: goals?.length, tasksCount: todayTasks?.length });

  // Render fallback UI while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render the main dashboard UI
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Debug info */}
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h2 className="font-bold">Debug Info:</h2>
        <p>Goals: {Array.isArray(goals) ? goals.length : 'Not an array'}</p>
        <p>Tasks: {Array.isArray(todayTasks) ? todayTasks.length : 'Not an array'}</p>
      </div>
      
      {/* Goals Progress Summary */}
      <ProgressSummary goals={goals} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <TodayTasks tasks={todayTasks} />
        
        {/* Recent Goals */}
        <RecentGoals goals={goals.slice(0, 5)} />
      </div>
    </div>
  );
};

export default DashboardPage;