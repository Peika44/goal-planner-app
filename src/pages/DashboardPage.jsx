// pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import GoalCard from '../components/dashboard/GoalCard';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import axios from '../api/axios'; // Adjust the import based on your axios setup

const DashboardPage = () => {
  const [goals, setGoals] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch goals
        const goalsResponse = await axios.get('/goals');
        setGoals(goalsResponse.data);
        
        // Fetch today's tasks
        const tasksResponse = await axios.get('/tasks/today');
        setTodaysTasks(tasksResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
          <Link
            to="/goals/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Goal
          </Link>
        </div>

        {/* Progress Summary */}
        <div className="mb-8">
          <ProgressSummary goals={goals} />
        </div>

        {/* Two-column layout for larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals Section - Takes 2/3 of the space on large screens */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Active Goals</h2>
            
            {goals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => (
                  <GoalCard key={goal._id} goal={goal} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 mb-4">You don't have any goals yet.</p>
                <Link
                  to="/goals/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Your First Goal
                </Link>
              </div>
            )}
          </div>

          {/* Tasks Section - Takes 1/3 of the space on large screens */}
          <div>
            <UpcomingTasks tasks={todaysTasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;