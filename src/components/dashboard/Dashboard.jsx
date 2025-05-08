// components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoals } from '../../hooks/useGoals';
import { useAuth } from '../../hooks/useAuth';
import GoalCard from './GoalCard';
import UpcomingTasks from './UpcomingTasks';
import ProgressSummary from './ProgressSummary';
import MotivationalQuote from './MotivationalQuote';
import RecentActivity from './RecentActivity';
import Navbar from '../layout/Navbar';
import SidePanel from '../layout/SidePanel';
import taskApi from '../../api/taskApi';
import { formatDate } from '../../utils/dateUtils';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { goals, loading, error, fetchGoals } = useGoals();
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format current date for display
  const currentDate = formatDate(new Date());

  useEffect(() => {
    const fetchTodaysTasks = async () => {
      setTasksLoading(true);
      setTasksError('');
      
      try {
        const response = await taskApi.getTodayTasks();
        if (response.success) {
          setTodaysTasks(response.data);
        } else {
          setTasksError(response.error);
        }
      } catch (err) {
        setTasksError('An error occurred while fetching today\'s tasks');
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTodaysTasks();
  }, []);

  // Refresh data
  const handleRefresh = async () => {
    await fetchGoals();
    
    // Reload today's tasks
    try {
      const response = await taskApi.getTodayTasks();
      if (response.success) {
        setTodaysTasks(response.data);
      }
    } catch (error) {
      console.error('Error refreshing tasks', error);
    }
  };

  const handleCompleteTask = async (taskId, completed) => {
    try {
      const response = await taskApi.completeTask(taskId, completed);
      
      if (response.success) {
        // Update todaysTasks state
        setTodaysTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId ? { ...task, completed } : task
          )
        );
        
        // Refresh goals to update progress
        fetchGoals();
      }
    } catch (error) {
      console.error('Error completing task', error);
    }
  };

  // Filter active goals
  const activeGoals = goals.filter(goal => !goal.completed);
  
  // Calculate overall progress statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.completed).length;
  const activeGoalsCount = activeGoals.length;
  
  // Get tasks statistics across all goals
  const allTasks = goals.flatMap(goal => goal.tasks || []);
  const completedTasks = allTasks.filter(task => task.completed).length;
  const totalTasks = allTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Side Panel */}
        <SidePanel />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-600 mt-1">{currentDate}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center">
                  <span className="mr-3 text-sm font-medium text-gray-700">
                    Welcome back, {currentUser?.name || 'User'}
                  </span>
                  <button 
                    onClick={handleRefresh}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'goals' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Goals
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tasks' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tasks
                </button>
              </nav>
            </div>
            
            {loading || tasksLoading ? (
              <div className="text-center py-12">
                <div className="spinner"></div>
                <p className="mt-4 text-gray-600">Loading your dashboard...</p>
              </div>
            ) : error || tasksError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error || tasksError}
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    {/* Progress Stats */}
                    <div className="mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white shadow rounded-lg p-6">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 bg-opacity-75">
                              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-500 truncate">Active Goals</p>
                              <p className="mt-1 text-3xl font-semibold text-gray-900">{activeGoalsCount}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white shadow rounded-lg p-6">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 bg-opacity-75">
                              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-500 truncate">Completed Goals</p>
                              <p className="mt-1 text-3xl font-semibold text-gray-900">{completedGoals}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white shadow rounded-lg p-6">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 bg-opacity-75">
                              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-500 truncate">Today's Tasks</p>
                              <p className="mt-1 text-3xl font-semibold text-gray-900">{todaysTasks.length}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white shadow rounded-lg p-6">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100 bg-opacity-75">
                              <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-500 truncate">Completion Rate</p>
                              <p className="mt-1 text-3xl font-semibold text-gray-900">{completionRate}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Two-column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Main Content - 2/3 width */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Active Goals */}
                        <div className="bg-white shadow rounded-lg p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Active Goals</h2>
                            <Link 
                              to="/goals/new"
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              + New Goal
                            </Link>
                          </div>
                          
                          {activeGoals.length === 0 ? (
                            <div className="text-center py-6">
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">You don't have any active goals</p>
                              <Link
                                to="/goals/new"
                                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                              >
                                Create Your First Goal
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {activeGoals.slice(0, 3).map((goal) => (
                                <GoalCard key={goal._id} goal={goal} compact={true} />
                              ))}
                              
                              {activeGoals.length > 3 && (
                                <div className="text-center pt-2">
                                  <Link
                                    to="/goals"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    View All Goals ({activeGoals.length})
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Motivational Quote */}
                        <MotivationalQuote />
                        
                        {/* Recent Activity */}
                        <RecentActivity goals={goals} />
                      </div>
                      
                      {/* Sidebar - 1/3 width */}
                      <div className="space-y-6">
                        {/* Today's Tasks */}
                        <div className="bg-white shadow rounded-lg p-6">
                          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Tasks</h2>
                          
                          <UpcomingTasks 
                            tasks={todaysTasks} 
                            onCompleteTask={handleCompleteTask} 
                          />
                        </div>
                        
                        {/* Progress Summary */}
                        <ProgressSummary goals={goals} />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Goals Tab */}
                {activeTab === 'goals' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">All Goals</h2>
                      <Link
                        to="/goals/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Create New Goal
                      </Link>
                    </div>
                    
                    {goals.length === 0 ? (
                      <div className="bg-white shadow rounded-lg p-6 text-center">
                        <p className="text-gray-500 mb-4">You don't have any goals yet</p>
                        <Link
                          to="/goals/new"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Create Your First Goal
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal) => (
                          <GoalCard key={goal._id} goal={goal} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                  <div>
                    <div className="bg-white shadow rounded-lg p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">All Tasks</h2>
                      
                      {todaysTasks.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No tasks for today</p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Today's Tasks</h3>
                          </div>
                          
                          <UpcomingTasks 
                            tasks={todaysTasks} 
                            onCompleteTask={handleCompleteTask}
                            expanded={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;