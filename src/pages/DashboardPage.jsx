import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGoals } from '../api/goalApi';
import { getTodayTasks, completeTask } from '../api/taskApi';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import TodayTasks from '../components/dashboard/TodayTasks';
import RecentGoals from '../components/dashboard/RecentGoals';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import { useToast } from '../components/ui/Toast';
import { 
  SkeletonStatsGrid, 
  SkeletonGoalList, 
  SkeletonTaskList,
  SkeletonTaskItem,
  SkeletonGoalCard,
  SkeletonTaskCard
} from '../components/loaders/SkeletonLoaders';
import { NoGoalsEmptyState, NoTasksEmptyState } from '../components/ui/EmptyState';

const DashboardPage = () => {
  const [goals, setGoals] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState({ goals: true, tasks: true });
  const [error, setError] = useState({ goals: null, tasks: null });
  const [refreshing, setRefreshing] = useState(false);
  
  const toast = useToast();

  // Load dashboard data
  useEffect(() => {
    fetchGoals();
    fetchTasks();
  }, []);

  // Fetch goals data
  const fetchGoals = async () => {
    try {
      setLoading(prev => ({ ...prev, goals: true }));
      setError(prev => ({ ...prev, goals: null }));
      
      const response = await getAllGoals();
      
      if (response.success) {
        setGoals(response.data || []);
      } else {
        setError(prev => ({ ...prev, goals: response.error || 'Failed to fetch goals' }));
        setGoals([]);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(prev => ({ ...prev, goals: 'An unexpected error occurred while fetching goals' }));
      setGoals([]);
    } finally {
      setLoading(prev => ({ ...prev, goals: false }));
    }
  };

  // Fetch tasks data
  const fetchTasks = async () => {
    try {
      setLoading(prev => ({ ...prev, tasks: true }));
      setError(prev => ({ ...prev, tasks: null }));
      
      const response = await getTodayTasks();
      
      if (response.success) {
        setTodayTasks(response.data || []);
      } else {
        setError(prev => ({ ...prev, tasks: response.error || "Failed to fetch today's tasks" }));
        setTodayTasks([]);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(prev => ({ ...prev, tasks: 'An unexpected error occurred while fetching tasks' }));
      setTodayTasks([]);
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([fetchGoals(), fetchTasks()]);
      toast.success('Dashboard refreshed');
    } catch (err) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate dashboard stats
  const stats = {
    totalGoals: goals.length,
    completedGoals: goals.filter(goal => goal.isCompleted).length,
    activeGoals: goals.filter(goal => !goal.isCompleted).length,
    upcomingTasks: todayTasks.filter(task => !task.isCompleted).length,
    completedTasks: todayTasks.filter(task => task.isCompleted).length,
    totalTasks: todayTasks.length,
    completionRate: goals.length > 0 
      ? Math.round((goals.filter(goal => goal.isCompleted).length / goals.length) * 100) 
      : 0
  };

  // Handle task completion toggle
  const handleCompleteTask = async (taskId) => {
    // Store original task state to revert if needed
    const originalTask = todayTasks.find(task => task._id === taskId);
    const originalState = originalTask ? originalTask.isCompleted : false;
    
    try {
      // Optimistic UI update
      setTodayTasks(
        todayTasks.map(task => 
          task._id === taskId 
            ? { ...task, isCompleted: !task.isCompleted } 
            : task
        )
      );
      
      // API call
      const response = await completeTask(taskId);
      
      if (!response.success) {
        // Revert change if failed
        setTodayTasks(
          todayTasks.map(task => 
            task._id === taskId 
              ? { ...task, isCompleted: originalState } 
              : task
          )
        );
        toast.error('Failed to update task: ' + response.error);
      } else {
        // Show success message
        toast.success(`Task ${originalState ? 'uncompleted' : 'completed'}`);
        // Refresh goals to update completion percentages
        fetchGoals();
      }
    } catch (err) {
      console.error('Complete task error:', err);
      
      // Revert change if failed
      setTodayTasks(
        todayTasks.map(task => 
          task._id === taskId 
            ? { ...task, isCompleted: originalState } 
            : task
        )
      );
      toast.error('An error occurred while updating the task');
    }
  };

  // Render dashboard tabs
  const renderTabs = () => {
    return (
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === 'goals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Goals
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tasks
            </button>
          </nav>
        </div>
      </div>
    );
  };

  // Render stats grid
  const renderStatsGrid = () => {
    if (loading.goals) {
      return <SkeletonStatsGrid />;
    }

    if (error.goals) {
      return (
        <ErrorDisplay 
          message={error.goals} 
          onRetry={fetchGoals}
          inline={true}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Goals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalGoals}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100 text-green-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed Goals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedGoals}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-yellow-100 text-yellow-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Today's Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-purple-100 text-purple-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render overdue tasks section (for overview)
  const renderOverdueTasks = () => {
    // Calculate which tasks are overdue (due date before today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = todayTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return !task.isCompleted && taskDate < today;
    });

    if (overdueTasks.length === 0) {
      return null;
    }

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              You have {overdueTasks.length} overdue {overdueTasks.length === 1 ? 'task' : 'tasks'}
            </h3>
            <div className="mt-2 space-y-2">
              {overdueTasks.slice(0, 3).map(task => (
                <div key={task._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => handleCompleteTask(task._id)}
                    className="h-4 w-4 text-red-600 border-red-300 rounded"
                  />
                  <label htmlFor={`task-${task._id}`} className="ml-2 text-sm text-red-700">
                    {task.title}
                  </label>
                </div>
              ))}
              {overdueTasks.length > 3 && (
                <Link to="/tasks" className="text-sm font-medium text-red-700 hover:text-red-900">
                  View all overdue tasks
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {refreshing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>
      
      {/* Tab navigation */}
      {renderTabs()}
      
      {/* Tab content */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          {renderStatsGrid()}
          
          {/* Overdue Tasks Alert */}
          {renderOverdueTasks()}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Tasks */}
            {loading.tasks ? (
              <SkeletonTaskList />
            ) : error.tasks ? (
              <ErrorDisplay 
                message={error.tasks} 
                onRetry={fetchTasks}
                inline={false}
              />
            ) : todayTasks.length === 0 ? (
              <NoTasksEmptyState />
            ) : (
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Today's Tasks</h2>
                  <Link 
                    to="/goals" 
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {todayTasks.map(task => (
                    <div key={task._id} className="py-3 flex items-start">
                      <div className="mr-3 pt-1">
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => handleCompleteTask(task._id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-all duration-150"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        {task.goal && (
                          <p className="text-xs text-gray-500 truncate">
                            Goal: {typeof task.goal === 'object' ? task.goal.title : 'Unknown Goal'}
                          </p>
                        )}
                      </div>
                      <div className="ml-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent Goals */}
            {loading.goals ? (
              <SkeletonGoalList />
            ) : error.goals ? (
              <ErrorDisplay 
                message={error.goals} 
                onRetry={fetchGoals}
                inline={false}
              />
            ) : goals.length === 0 ? (
              <NoGoalsEmptyState />
            ) : (
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Goals</h2>
                  <Link 
                    to="/goals" 
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {goals.slice(0, 5).map(goal => (
                    <Link 
                      key={goal._id} 
                      to={`/goals/${goal._id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${goal.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {goal.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              goal.category === 'Personal' ? 'bg-purple-100 text-purple-800' :
                              goal.category === 'Professional' ? 'bg-blue-100 text-blue-800' :
                              goal.category === 'Health' ? 'bg-green-100 text-green-800' :
                              goal.category === 'Financial' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {goal.category}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              Due: {formatDate(goal.targetDate)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 relative w-16">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div 
                              style={{ width: `${goal.progress}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-300"
                            ></div>
                          </div>
                          <div className="text-right mt-1 text-xs text-gray-500">{goal.progress}%</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      {activeTab === 'goals' && (
        <div className="bg-white p-6 rounded-lg shadow">
          {loading.goals ? (
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
              <SkeletonGoalList />
            </div>
          ) : error.goals ? (
            <ErrorDisplay 
              message={error.goals} 
              onRetry={fetchGoals}
              inline={false}
            />
          ) : goals.length === 0 ? (
            <NoGoalsEmptyState />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Goals</h2>
                <Link 
                  to="/goals/new"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-1 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Goal
                </Link>
              </div>
              
              <div className="space-y-4">
                {goals.map(goal => (
                  <Link 
                    key={goal._id} 
                    to={`/goals/${goal._id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`text-lg font-medium ${goal.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {goal.title}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            goal.category === 'Personal' ? 'bg-purple-100 text-purple-800' :
                            goal.category === 'Professional' ? 'bg-blue-100 text-blue-800' :
                            goal.category === 'Health' ? 'bg-green-100 text-green-800' :
                            goal.category === 'Financial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {goal.category}
                          </span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                            goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {goal.priority}
                          </span>
                          {goal.isCompleted && (
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {goal.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Due: {formatDate(goal.targetDate)}
                        </p>
                      </div>
                      <div className="w-16">
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${goal.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                          </div>
                          <div className="text-right mt-1 text-xs text-gray-500">{goal.progress}%</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'tasks' && (
        <div className="bg-white p-6 rounded-lg shadow">
          {loading.tasks ? (
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="divide-y divide-gray-200">
                <SkeletonTaskItem />
                <SkeletonTaskItem />
                <SkeletonTaskItem />
                <SkeletonTaskItem />
              </div>
            </div>
          ) : error.tasks ? (
            <ErrorDisplay 
              message={error.tasks} 
              onRetry={fetchTasks}
              inline={false}
            />
          ) : todayTasks.length === 0 ? (
            <NoTasksEmptyState />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Today's Tasks</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {todayTasks.filter(t => t.isCompleted).length} of {todayTasks.length} completed
                  </span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ 
                        width: `${todayTasks.length > 0 
                          ? Math.round((todayTasks.filter(t => t.isCompleted).length / todayTasks.length) * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {todayTasks.map(task => (
                  <div key={task._id} className="py-4 flex items-start group">
                    <div className="mr-4 pt-1">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleCompleteTask(task._id)}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-all duration-150"
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium transition-all duration-200 ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className={`mt-1 text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center">
                        {task.goal && typeof task.goal === 'object' && (
                          <span className="text-xs text-gray-500">
                            Goal: {task.goal.title}
                          </span>
                        )}
                        <span className="mx-2 text-gray-300">•</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCompleteTask(task._id);
                        }}
                        className={`p-1 rounded-full ${task.isCompleted ? 'text-green-600 hover:text-green-900 hover:bg-green-100' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                        title={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {task.isCompleted ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;