import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGoals, deleteGoal, completeGoal } from '../api/goalApi';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAllGoals();
        
        if (response.success) {
          setGoals(response.data);
        } else {
          setError(response.error || 'Failed to fetch goals');
          setGoals([]);
        }
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('An unexpected error occurred. Please try again.');
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Filter and search goals
  useEffect(() => {
    let result = [...goals];
    
    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(goal => 
        filter === 'completed' ? goal.isCompleted : 
        filter === 'active' ? !goal.isCompleted :
        goal.category === filter
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(goal =>
        goal.title.toLowerCase().includes(term) ||
        goal.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredGoals(result);
  }, [goals, filter, searchTerm]);

  // Handle goal deletion
  const handleDeleteGoal = async (goalId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        const response = await deleteGoal(goalId);
        
        if (response.success) {
          setGoals(goals.filter(goal => goal._id !== goalId));
        } else {
          setError(response.error || 'Failed to delete goal');
        }
      } catch (err) {
        console.error('Delete goal error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  // Handle goal completion
  const handleCompleteGoal = async (goalId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await completeGoal(goalId);
      
      if (response.success) {
        setGoals(goals.map(goal => 
          goal._id === goalId ? response.data : goal
        ));
      } else {
        setError(response.error || 'Failed to complete goal');
      }
    } catch (err) {
      console.error('Complete goal error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Personal':
        return 'bg-purple-100 text-purple-800';
      case 'Professional':
        return 'bg-blue-100 text-blue-800';
      case 'Health':
        return 'bg-green-100 text-green-800';
      case 'Financial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Educational':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Goals</h1>
        <Link
          to="/goals/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Goal
        </Link>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="md:flex justify-between">
          <div className="mb-4 md:mb-0">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full md:w-auto"
            >
              <option value="all">All Goals</option>
              <option value="active">Active Goals</option>
              <option value="completed">Completed Goals</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
              <option value="Health">Health</option>
              <option value="Financial">Financial</option>
              <option value="Educational">Educational</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search goals:
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description"
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Goals list */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-xl">Loading goals...</p>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-lg text-gray-500 mb-4">
            {searchTerm
              ? 'No goals match your search criteria'
              : filter !== 'all'
              ? 'No goals match the selected filter'
              : 'You have not created any goals yet'}
          </p>
          <Link
            to="/goals/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create your first goal
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredGoals.map(goal => (
              <li key={goal._id} className="hover:bg-gray-50">
                <Link to={`/goals/${goal._id}`} className="block">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className={`text-lg font-medium ${goal.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {goal.title}
                          </h3>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getCategoryColor(goal.category)}`}>
                            {goal.category}
                          </span>
                          {goal.isCompleted && (
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {goal.description}
                        </p>
                        
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span>Target: {formatDate(goal.targetDate)}</span>
                          <span className="mx-2">•</span>
                          <span className={`${
                            goal.priority === 'High' ? 'text-red-600' :
                            goal.priority === 'Medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {goal.priority} Priority
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0 flex items-center">
                        <div className="mr-4 w-16">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 text-right mt-1">{goal.progress}%</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          {!goal.isCompleted && (
                            <button
                              onClick={(e) => handleCompleteGoal(goal._id, e)}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as complete"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => handleDeleteGoal(goal._id, e)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete goal"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;