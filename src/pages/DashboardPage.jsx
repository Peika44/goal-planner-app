import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGoals } from '../api/goalApi';
import { getTodayTasks, completeTask } from '../api/taskApi';
import { useToast } from '../components/ui/Toast';
import { 
  SkeletonStatsGrid, 
  SkeletonGoalList, 
  SkeletonTaskList 
} from '../components/loaders/SkeletonLoaders';
import { NoGoalsEmptyState, NoTasksEmptyState } from '../components/ui/EmptyState';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import './DashboardPage.css'; // Energetic, colorful styling

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

  // Format date helper function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="dashboard-button dashboard-refresh-button"
        >
          {refreshing ? (
            <>
              <svg className="dashboard-icon dashboard-icon-spin" viewBox="0 0 24 24">
                <circle className="dashboard-icon-loader-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="dashboard-icon-loader" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="dashboard-icon" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`dashboard-tab ${activeTab === 'overview' ? 'dashboard-tab-active' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`dashboard-tab ${activeTab === 'goals' ? 'dashboard-tab-active' : ''}`}
        >
          Goals
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`dashboard-tab ${activeTab === 'tasks' ? 'dashboard-tab-active' : ''}`}
        >
          Tasks
        </button>
      </div>
      
      {/* Content Panel with frosted glass effect */}
      <div className="dashboard-panel">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            {loading.goals ? (
              <SkeletonStatsGrid />
            ) : error.goals ? (
              <ErrorDisplay 
                message={error.goals} 
                onRetry={fetchGoals}
                inline={true}
              />
            ) : (
              <div className="dashboard-stats-grid">
                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon dashboard-stat-icon-blue">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="dashboard-stat-content">
                    <p className="dashboard-stat-label">Total Goals</p>
                    <p className="dashboard-stat-value">{stats.totalGoals}</p>
                  </div>
                </div>
                
                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon dashboard-stat-icon-green">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="dashboard-stat-content">
                    <p className="dashboard-stat-label">Completed Goals</p>
                    <p className="dashboard-stat-value">{stats.completedGoals}</p>
                  </div>
                </div>
                
                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon dashboard-stat-icon-yellow">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="dashboard-stat-content">
                    <p className="dashboard-stat-label">Today's Tasks</p>
                    <p className="dashboard-stat-value">{stats.totalTasks}</p>
                  </div>
                </div>
                
                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon dashboard-stat-icon-purple">
                    <svg viewBox="0 0 24 24">
                      <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div className="dashboard-stat-content">
                    <p className="dashboard-stat-label">Completion Rate</p>
                    <p className="dashboard-stat-value">{stats.completionRate}%</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Overdue Tasks Alert */}
            {todayTasks.some(task => {
              const taskDate = new Date(task.dueDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return !task.isCompleted && taskDate < today;
            }) && (
              <div className="dashboard-alert dashboard-alert-overdue">
                <div className="dashboard-alert-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="dashboard-alert-content">
                  <h3 className="dashboard-alert-title">
                    You have overdue tasks
                  </h3>
                  <div className="dashboard-alert-actions">
                    <Link to="/tasks" className="dashboard-link">
                      View all overdue tasks
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            <div className="dashboard-grid">
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
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h2 className="dashboard-card-title">Today's Tasks</h2>
                    <Link 
                      to="/tasks" 
                      className="dashboard-link"
                    >
                      View All
                    </Link>
                  </div>
                  
                  <div className="dashboard-task-list">
                    {todayTasks.map(task => (
                      <div key={task._id} className="dashboard-task-item">
                        <div className="dashboard-task-checkbox">
                          <input
                            type="checkbox"
                            id={`task-${task._id}`}
                            checked={task.isCompleted}
                            onChange={() => handleCompleteTask(task._id)}
                            className="dashboard-checkbox"
                          />
                          <label htmlFor={`task-${task._id}`} className="dashboard-checkbox-label"></label>
                        </div>
                        <div className="dashboard-task-content">
                          <p className={`dashboard-task-title ${task.isCompleted ? 'dashboard-task-completed' : ''}`}>
                            {task.title}
                          </p>
                          {task.goal && (
                            <p className="dashboard-task-meta">
                              Goal: {typeof task.goal === 'object' ? task.goal.title : 'Unknown Goal'}
                            </p>
                          )}
                        </div>
                        <div className="dashboard-task-badge">
                          <span className={`dashboard-badge ${
                            task.priority === 'High' ? 'dashboard-badge-red' :
                            task.priority === 'Medium' ? 'dashboard-badge-yellow' :
                            'dashboard-badge-green'
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
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h2 className="dashboard-card-title">Recent Goals</h2>
                    <Link 
                      to="/goals" 
                      className="dashboard-link"
                    >
                      View All
                    </Link>
                  </div>
                  
                  <div className="dashboard-goal-list">
                    {goals.slice(0, 5).map(goal => (
                      <Link 
                        key={goal._id} 
                        to={`/goals/${goal._id}`}
                        className="dashboard-goal-item"
                      >
                        <div className="dashboard-goal-content">
                          <p className={`dashboard-goal-title ${goal.isCompleted ? 'dashboard-goal-completed' : ''}`}>
                            {goal.title}
                          </p>
                          <div className="dashboard-goal-meta">
                            <span className={`dashboard-badge ${
                              goal.category === 'Personal' ? 'dashboard-badge-purple' :
                              goal.category === 'Professional' ? 'dashboard-badge-blue' :
                              goal.category === 'Health' ? 'dashboard-badge-green' :
                              goal.category === 'Financial' ? 'dashboard-badge-yellow' :
                              'dashboard-badge-gray'
                            }`}>
                              {goal.category}
                            </span>
                            <span className="dashboard-goal-date">
                              Due: {formatDate(goal.targetDate)}
                            </span>
                          </div>
                        </div>
                        <div className="dashboard-goal-progress">
                          <div className="dashboard-progress-bar">
                            <div 
                              className="dashboard-progress-value" 
                              style={{ width: `${goal.progress}%` }} 
                            ></div>
                          </div>
                          <div className="dashboard-progress-text">{goal.progress}%</div>
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
          <div className="dashboard-goals-content">
            {loading.goals ? (
              <div className="dashboard-loading">
                <div className="dashboard-loading-indicator"></div>
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
                <div className="dashboard-section-header">
                  <h2 className="dashboard-section-title">All Goals</h2>
                  <Link 
                    to="/goals/new"
                    className="dashboard-button dashboard-button-small"
                  >
                    <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                    New Goal
                  </Link>
                </div>
                
                <div className="dashboard-goal-grid">
                  {goals.map(goal => (
                    <Link 
                      key={goal._id} 
                      to={`/goals/${goal._id}`}
                      className="dashboard-goal-card"
                    >
                      <h3 className={`dashboard-goal-card-title ${goal.isCompleted ? 'dashboard-goal-completed' : ''}`}>
                        {goal.title}
                      </h3>
                      <div className="dashboard-goal-card-badges">
                        <span className={`dashboard-badge ${
                          goal.category === 'Personal' ? 'dashboard-badge-purple' :
                          goal.category === 'Professional' ? 'dashboard-badge-blue' :
                          goal.category === 'Health' ? 'dashboard-badge-green' :
                          goal.category === 'Financial' ? 'dashboard-badge-yellow' :
                          'dashboard-badge-gray'
                        }`}>
                          {goal.category}
                        </span>
                        <span className={`dashboard-badge ${
                          goal.priority === 'High' ? 'dashboard-badge-red' :
                          goal.priority === 'Medium' ? 'dashboard-badge-yellow' :
                          'dashboard-badge-green'
                        }`}>
                          {goal.priority}
                        </span>
                        {goal.isCompleted && (
                          <span className="dashboard-badge dashboard-badge-green">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="dashboard-goal-card-description">
                        {goal.description}
                      </p>
                      <p className="dashboard-goal-card-date">
                        Due: {formatDate(goal.targetDate)}
                      </p>
                      <div className="dashboard-goal-card-progress">
                        <div className="dashboard-progress-bar">
                          <div className="dashboard-progress-value" style={{ width: `${goal.progress}%` }}></div>
                        </div>
                        <div className="dashboard-progress-text">{goal.progress}%</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="dashboard-tasks-content">
            {loading.tasks ? (
              <div className="dashboard-loading">
                <div className="dashboard-loading-indicator"></div>
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
                <div className="dashboard-section-header">
                  <h2 className="dashboard-section-title">Today's Tasks</h2>
                  <div className="dashboard-task-summary">
                    <span className="dashboard-task-count">
                      {todayTasks.filter(t => t.isCompleted).length} of {todayTasks.length} completed
                    </span>
                    <div className="dashboard-task-progress">
                      <div 
                        className="dashboard-task-progress-value" 
                        style={{ 
                          width: `${todayTasks.length > 0 
                            ? Math.round((todayTasks.filter(t => t.isCompleted).length / todayTasks.length) * 100) 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-detailed-task-list">
                  {todayTasks.map(task => (
                    <div key={task._id} className="dashboard-detailed-task-item">
                      <div className="dashboard-task-checkbox">
                        <input
                          type="checkbox"
                          id={`detailed-task-${task._id}`}
                          checked={task.isCompleted}
                          onChange={() => handleCompleteTask(task._id)}
                          className="dashboard-checkbox"
                        />
                        <label htmlFor={`detailed-task-${task._id}`} className="dashboard-checkbox-label"></label>
                      </div>
                      <div className="dashboard-detailed-task-content">
                        <p className={`dashboard-detailed-task-title ${task.isCompleted ? 'dashboard-task-completed' : ''}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="dashboard-detailed-task-description">
                            {task.description}
                          </p>
                        )}
                        <div className="dashboard-detailed-task-meta">
                          {task.goal && typeof task.goal === 'object' && (
                            <span className="dashboard-task-goal">
                              Goal: {task.goal.title}
                            </span>
                          )}
                          <span className={`dashboard-badge ${
                            task.priority === 'High' ? 'dashboard-badge-red' :
                            task.priority === 'Medium' ? 'dashboard-badge-yellow' :
                            'dashboard-badge-green'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="dashboard-task-actions">
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="dashboard-task-action-button"
                          title={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                        >
                          <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24" width={4} height={4}>
                            {task.isCompleted ? (
                              <path d="M5 13l4 4L19 7" />
                            ) : (
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    </div>
  );
};

export default DashboardPage;