import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getGoalById, updateGoal, completeGoal, deleteGoal } from '../api/goalApi';
import { getTasksByGoal, createTask, completeTask, deleteTask, generateTasks } from '../api/taskApi';

const GoalDetailPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  
  const [goal, setGoal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium'
  });
  const [taskFormLoading, setTaskFormLoading] = useState(false);
  const [taskFormError, setTaskFormError] = useState('');
  
  // Edit goal state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: '',
    priority: ''
  });
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [editFormError, setEditFormError] = useState('');
  
  // Fetch goal and tasks data
  useEffect(() => {
    const fetchGoalData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch goal details
        const goalResponse = await getGoalById(goalId);
        
        if (goalResponse.success) {
          setGoal(goalResponse.data);
          
          // Pre-fill edit form
          setEditFormData({
            title: goalResponse.data.title,
            description: goalResponse.data.description,
            category: goalResponse.data.category,
            targetDate: goalResponse.data.targetDate.split('T')[0], // Format date for input
            priority: goalResponse.data.priority
          });
          
          // Fetch tasks for this goal
          const tasksResponse = await getTasksByGoal(goalId);
          
          if (tasksResponse.success) {
            setTasks(tasksResponse.data);
          } else {
            console.error('Failed to fetch tasks:', tasksResponse.error);
            setTasks([]);
          }
        } else {
          setError(goalResponse.error || 'Failed to fetch goal details');
        }
      } catch (err) {
        console.error('Error fetching goal data:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoalData();
  }, [goalId]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle task form changes
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({
      ...taskFormData,
      [name]: value
    });
  };
  
  // Handle task form submission
  const handleTaskFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskFormData.title || !taskFormData.dueDate) {
      setTaskFormError('Please fill in all required fields');
      return;
    }
    
    try {
      setTaskFormLoading(true);
      setTaskFormError('');
      
      const response = await createTask(goalId, taskFormData);
      
      if (response.success) {
        // Add new task to the list
        setTasks([...tasks, response.data]);
        
        // Reset form
        setTaskFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: 'Medium'
        });
        
        setShowTaskForm(false);
      } else {
        setTaskFormError(response.error || 'Failed to create task');
      }
    } catch (err) {
      console.error('Create task error:', err);
      setTaskFormError('An unexpected error occurred. Please try again.');
    } finally {
      setTaskFormLoading(false);
    }
  };
  
  // Handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  // Handle edit form submission
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.title || !editFormData.description || !editFormData.targetDate) {
      setEditFormError('Please fill in all required fields');
      return;
    }
    
    try {
      setEditFormLoading(true);
      setEditFormError('');
      
      const response = await updateGoal(goalId, editFormData);
      
      if (response.success) {
        setGoal(response.data);
        setShowEditForm(false);
      } else {
        setEditFormError(response.error || 'Failed to update goal');
      }
    } catch (err) {
      console.error('Update goal error:', err);
      setEditFormError('An unexpected error occurred. Please try again.');
    } finally {
      setEditFormLoading(false);
    }
  };
  
  // Handle goal completion
  const handleCompleteGoal = async () => {
    try {
      const response = await completeGoal(goalId);
      
      if (response.success) {
        setGoal(response.data);
      } else {
        setError(response.error || 'Failed to complete goal');
      }
    } catch (err) {
      console.error('Complete goal error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };
  
  // Handle goal deletion
  const handleDeleteGoal = async () => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        const response = await deleteGoal(goalId);
        
        if (response.success) {
          navigate('/goals');
        } else {
          setError(response.error || 'Failed to delete goal');
        }
      } catch (err) {
        console.error('Delete goal error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  // Handle task completion toggle
  const handleToggleTaskCompletion = async (taskId) => {
    try {
      const response = await completeTask(taskId);
      
      if (response.success) {
        // Update task in the list
        setTasks(tasks.map(task => 
          task._id === taskId ? response.data : task
        ));
      } else {
        console.error('Failed to update task:', response.error);
      }
    } catch (err) {
      console.error('Toggle task completion error:', err);
    }
  };
  
  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await deleteTask(taskId);
        
        if (response.success) {
          // Remove task from the list
          setTasks(tasks.filter(task => task._id !== taskId));
        } else {
          console.error('Failed to delete task:', response.error);
        }
      } catch (err) {
        console.error('Delete task error:', err);
      }
    }
  };
  
  // Generate AI tasks
  const handleGenerateTasks = async () => {
    try {
      setLoading(true);
      
      const response = await generateTasks(goalId);
      
      if (response.success) {
        // Show tasks for confirmation
        const tasksToAdd = response.data;
        
        if (window.confirm(`AI has generated ${tasksToAdd.length} tasks for this goal. Would you like to add them?`)) {
          // Add all tasks
          for (const taskData of tasksToAdd) {
            await createTask(goalId, taskData);
          }
          
          // Refresh tasks
          const tasksResponse = await getTasksByGoal(goalId);
          if (tasksResponse.success) {
            setTasks(tasksResponse.data);
          }
        }
      } else {
        setError(response.error || 'Failed to generate tasks');
      }
    } catch (err) {
      console.error('Generate tasks error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get today's date in YYYY-MM-DD format for date inputs
  const today = new Date().toISOString().split('T')[0];
  
  if (loading && !goal) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading-center">
          <div className="dashboard-loading-spinner"></div>
          <p className="dashboard-loading-text">Loading goal details...</p>
        </div>
      </div>
    );
  }
  
  if (error && !goal) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Goal Details</h1>
          <Link to="/goals" className="dashboard-button dashboard-button-small dashboard-button-secondary">
            <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Goals
          </Link>
        </div>
        
        <div className="dashboard-panel">
          <div className="dashboard-alert dashboard-alert-error">
            <div className="dashboard-alert-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7v-2h2v2h-2zm0-8v4h2V7h-2z" />
              </svg>
            </div>
            <div className="dashboard-alert-content">
              <h3 className="dashboard-alert-title">{error}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!goal) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Goal Details</h1>
          <Link to="/goals" className="dashboard-button dashboard-button-small dashboard-button-secondary">
            <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Goals
          </Link>
        </div>
        
        <div className="dashboard-panel">
          <div className="dashboard-alert dashboard-alert-warning">
            <div className="dashboard-alert-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7v-2h2v2h-2zm0-8v4h2V7h-2z" />
              </svg>
            </div>
            <div className="dashboard-alert-content">
              <h3 className="dashboard-alert-title">Goal not found</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-title-group">
          <Link to="/goals" className="dashboard-back-link">
            <svg className="dashboard-back-icon" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Goals</span>
          </Link>
          <h1 className="dashboard-title">{goal.title}</h1>
        </div>
        
        <div className="dashboard-header-actions">
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="dashboard-button dashboard-button-small dashboard-button-secondary"
          >
            <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          {!goal.isCompleted && (
            <button
              onClick={handleCompleteGoal}
              className="dashboard-button dashboard-button-small dashboard-button-success"
            >
              <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
              </svg>
              Complete
            </button>
          )}
          
          <button
            onClick={handleDeleteGoal}
            className="dashboard-button dashboard-button-small dashboard-button-danger"
          >
            <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="dashboard-alert dashboard-alert-error">
          <div className="dashboard-alert-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7v-2h2v2h-2zm0-8v4h2V7h-2z" />
            </svg>
          </div>
          <div className="dashboard-alert-content">
            <h3 className="dashboard-alert-title">{error}</h3>
          </div>
        </div>
      )}
      
      {/* Edit goal form */}
      {showEditForm && (
        <div className="dashboard-panel dashboard-panel-form">
          <h2 className="dashboard-panel-title">Edit Goal</h2>
          
          {editFormError && (
            <div className="dashboard-alert dashboard-alert-error">
              <div className="dashboard-alert-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7v-2h2v2h-2zm0-8v4h2V7h-2z" />
                </svg>
              </div>
              <div className="dashboard-alert-content">
                <h3 className="dashboard-alert-title">{editFormError}</h3>
              </div>
            </div>
          )}
          
          <form onSubmit={handleEditFormSubmit}>
            <div className="dashboard-form-group">
              <label htmlFor="title" className="dashboard-form-label">
                Goal Title <span className="dashboard-form-required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editFormData.title}
                onChange={handleEditFormChange}
                className="dashboard-form-input"
                required
              />
            </div>
            
            <div className="dashboard-form-group">
              <label htmlFor="description" className="dashboard-form-label">
                Description <span className="dashboard-form-required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                className="dashboard-form-input dashboard-form-textarea"
                rows="4"
                required
              />
            </div>
            
            <div className="dashboard-form-row">
              <div className="dashboard-form-group">
                <label htmlFor="category" className="dashboard-form-label">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditFormChange}
                  className="dashboard-form-select"
                >
                  <option value="Personal">Personal</option>
                  <option value="Professional">Professional</option>
                  <option value="Health">Health</option>
                  <option value="Financial">Financial</option>
                  <option value="Educational">Educational</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="dashboard-form-group">
                <label htmlFor="priority" className="dashboard-form-label">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={editFormData.priority}
                  onChange={handleEditFormChange}
                  className="dashboard-form-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="dashboard-form-group">
                <label htmlFor="targetDate" className="dashboard-form-label">
                  Target Date <span className="dashboard-form-required">*</span>
                </label>
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  value={editFormData.targetDate}
                  onChange={handleEditFormChange}
                  className="dashboard-form-input"
                  min={today}
                  required
                />
              </div>
            </div>
            
            <div className="dashboard-form-actions">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="dashboard-button dashboard-button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editFormLoading}
                className="dashboard-button"
              >
                {editFormLoading ? (
                  <>
                    <svg className="dashboard-icon dashboard-icon-spin" viewBox="0 0 24 24">
                      <circle className="dashboard-icon-loader-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                      <path className="dashboard-icon-loader" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Goal</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Goal details */}
      <div className="dashboard-panel dashboard-goal-details">
        <div className="dashboard-goal-meta">
          <div className="dashboard-badges">
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
              {goal.priority} Priority
            </span>
            <span className={`dashboard-badge ${
              goal.isCompleted ? 'dashboard-badge-green' : 'dashboard-badge-blue'
            }`}>
              {goal.isCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
          
          <p className="dashboard-goal-description">{goal.description}</p>
          
          <div className="dashboard-goal-stats">
            <div className="dashboard-goal-stat">
              <span className="dashboard-goal-stat-label">Target Date</span>
              <span className="dashboard-goal-stat-value">{formatDate(goal.targetDate)}</span>
            </div>
            
            <div className="dashboard-goal-stat">
              <span className="dashboard-goal-stat-label">Created On</span>
              <span className="dashboard-goal-stat-value">{formatDate(goal.createdAt)}</span>
            </div>
            
            <div className="dashboard-goal-stat dashboard-goal-progress-stat">
              <span className="dashboard-goal-stat-label">Progress</span>
              <div className="dashboard-goal-progress">
                <div className="dashboard-progress-bar">
                  <div 
                    className="dashboard-progress-value" 
                    style={{ width: `${goal.progress}%` }}
                    aria-label={`${goal.progress}% complete`}
                  ></div>
                </div>
                <span className="dashboard-progress-text">{goal.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks section */}
      <div className="dashboard-panel dashboard-tasks-panel">
        <div className="dashboard-panel-header">
          <h2 className="dashboard-panel-title">Tasks</h2>
          <div className="dashboard-panel-actions">
            <button
              onClick={handleGenerateTasks}
              className="dashboard-button dashboard-button-small dashboard-button-ai"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="dashboard-icon dashboard-icon-small dashboard-icon-spin" viewBox="0 0 24 24">
                    <circle className="dashboard-icon-loader-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="dashboard-icon-loader" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate AI Tasks</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="dashboard-button dashboard-button-small"
            >
              <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>{showTaskForm ? 'Cancel' : 'Add Task'}</span>
            </button>
          </div>
        </div>
        
        {/* Task creation form */}
        {showTaskForm && (
          <div className="dashboard-task-form">
            <h3 className="dashboard-task-form-title">Add New Task</h3>
            
            {taskFormError && (
              <div className="dashboard-alert dashboard-alert-error">
                <div className="dashboard-alert-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7v-2h2v2h-2zm0-8v4h2V7h-2z" />
                  </svg>
                </div>
                <div className="dashboard-alert-content">
                  <h3 className="dashboard-alert-title">{taskFormError}</h3>
                </div>
              </div>
            )}
            
            <form onSubmit={handleTaskFormSubmit}>
              <div className="dashboard-form-group">
                <label htmlFor="taskTitle" className="dashboard-form-label">
                  Task Title <span className="dashboard-form-required">*</span>
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  name="title"
                  value={taskFormData.title}
                  onChange={handleTaskFormChange}
                  className="dashboard-form-input"
                  placeholder="What needs to be done?"
                  required
                />
              </div>
              
              <div className="dashboard-form-group">
                <label htmlFor="taskDescription" className="dashboard-form-label">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  name="description"
                  value={taskFormData.description}
                  onChange={handleTaskFormChange}
                  className="dashboard-form-input dashboard-form-textarea"
                  placeholder="Additional details..."
                  rows="2"
                />
              </div>
              
              <div className="dashboard-form-row">
                <div className="dashboard-form-group">
                  <label htmlFor="taskDueDate" className="dashboard-form-label">
                    Due Date <span className="dashboard-form-required">*</span>
                  </label>
                  <input
                    type="date"
                    id="taskDueDate"
                    name="dueDate"
                    value={taskFormData.dueDate}
                    onChange={handleTaskFormChange}
                    className="dashboard-form-input"
                    min={today}
                    required
                  />
                </div>
                
                <div className="dashboard-form-group">
                  <label htmlFor="taskPriority" className="dashboard-form-label">
                    Priority
                  </label>
                  <select
                    id="taskPriority"
                    name="priority"
                    value={taskFormData.priority}
                    onChange={handleTaskFormChange}
                    className="dashboard-form-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="dashboard-form-actions">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="dashboard-button dashboard-button-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={taskFormLoading}
                  className="dashboard-button"
                >
                  {taskFormLoading ? (
                    <>
                      <svg className="dashboard-icon dashboard-icon-spin" viewBox="0 0 24 24">
                        <circle className="dashboard-icon-loader-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                        <path className="dashboard-icon-loader" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Task</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Tasks list */}
        {loading ? (
          <div className="dashboard-loading">
            <div className="dashboard-loading-spinner"></div>
            <p className="dashboard-loading-text">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="dashboard-empty-state">
            <svg className="dashboard-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="dashboard-empty-state-title">No tasks yet</h3>
            <p className="dashboard-empty-state-message">Add tasks to break down your goal into manageable steps</p>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="dashboard-button dashboard-button-small"
            >
              <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add First Task</span>
            </button>
          </div>
        ) : (
          <ul className="dashboard-tasks-list">
            {tasks.map(task => (
              <li key={task._id} className={`dashboard-task-item ${task.isCompleted ? 'dashboard-task-completed' : ''}`}>
                <div className="dashboard-task-checkbox">
                  <input
                    type="checkbox"
                    id={`task-${task._id}`}
                    checked={task.isCompleted}
                    onChange={() => handleToggleTaskCompletion(task._id)}
                    className="dashboard-checkbox"
                  />
                  <label htmlFor={`task-${task._id}`} className="dashboard-checkbox-label"></label>
                </div>
                <div className="dashboard-task-content">
                  <h3 className={`dashboard-task-title ${task.isCompleted ? 'dashboard-task-title-completed' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="dashboard-task-description">{task.description}</p>
                  )}
                  <div className="dashboard-task-meta">
                    <span className="dashboard-task-due-date">
                      Due: {formatDate(task.dueDate)}
                    </span>
                    <span className={`dashboard-badge ${
                      task.priority === 'High' ? 'dashboard-badge-red' :
                      task.priority === 'Medium' ? 'dashboard-badge-yellow' :
                      'dashboard-badge-green'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="dashboard-task-delete"
                  aria-label="Delete task"
                >
                  <svg className="dashboard-task-delete-icon" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GoalDetailPage;