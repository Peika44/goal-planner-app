// pages/GoalsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import GoalCard from '../components/dashboard/GoalCard';
import axios from '../api/axios';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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

    fetchGoals();
  }, []);

  // Filter goals based on activeFilter
  const filteredGoals = goals.filter(goal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return !goal.completed;
    if (activeFilter === 'completed') return goal.completed;
    return true;
  });

  // Group goals by category
  const goalsByCategory = filteredGoals.reduce((acc, goal) => {
    const category = goal.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(goal);
    return acc;
  }, {});

  // Category labels mapping
  const categoryLabels = {
    personal: 'Personal Development',
    professional: 'Professional',
    health: 'Health & Fitness',
    education: 'Education',
    finance: 'Financial',
    social: 'Social & Relationships',
    other: 'Other'
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
          <Link
            to="/goals/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Goal
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="mb-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="all">All Goals</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeFilter === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  All Goals
                </button>
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeFilter === 'active'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter('completed')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeFilter === 'completed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  Completed
                </button>
              </nav>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {filteredGoals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">No goals found in this category.</p>
            <Link
              to="/goals/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Your First Goal
            </Link>
          </div>
        ) : (
          // Display goals by category
          Object.keys(goalsByCategory).map(category => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {categoryLabels[category] || 'Other'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goalsByCategory[category].map(goal => (
                  <GoalCard key={goal._id} goal={goal} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalsPage;