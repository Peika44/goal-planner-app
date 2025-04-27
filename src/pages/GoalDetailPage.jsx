import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  
  if (loading && !goal) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading goal details...</p>
      </div>
    );
  }
  
  if (error && !goal) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/goals')}
          >
            Go back to goals
          </button>
        </div>
      </div>
    );
  }
  
  if (!goal) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p>Goal not found</p>
          <button 
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/goals')}
          >
            Go back to goals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Error notification */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Goal header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{goal.title}</h1>
          <div className="flex items-center mt-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              goal.category === 'Personal' ? 'bg-purple-100 text-purple-800' :
              goal.category === 'Professional' ? 'bg-blue-100 text-blue-800' :
              goal.category === 'Health' ? 'bg-green-100 text-green-800' :
              goal.category === 'Financial' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {goal.category}
            </span>
            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
              goal.priority === 'High' ? 'bg-red-100 text-red-800' :
              goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {goal.priority} Priority
            </span>
            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
              goal.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {goal.isCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
          {!goal.isCompleted && (
            <button
              onClick={handleCompleteGoal}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={handleDeleteGoal}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Edit goal form */}
      {showEditForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Goal</h2>
          
          {editFormError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{editFormError}</p>
            </div>
          )}
          
          <form onSubmit={handleEditFormSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editFormData.title}
                onChange={handleEditFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Personal">Personal</option>
                  <option value="Professional">Professional</option>
                  <option value="Health">Health</option>
                  <option value="Financial">Financial</option>
                  <option value="Educational">Educational</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={editFormData.priority}
                  onChange={handleEditFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="targetDate" className="block text-gray-700 text-sm font-bold mb-2">
                  Target Date *
                </label>
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  value={editFormData.targetDate}
                  onChange={handleEditFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="mr-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editFormLoading}
                className={`${editFormLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                {editFormLoading ? 'Updating...' : 'Update Goal'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Goal details */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{goal.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Target Date</h3>
            <p>{formatDate(goal.targetDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Progress</h3>
            <div className="mt-1">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">{goal.progress}% complete</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Created On</h3>
            <p>{formatDate(goal.createdAt)}</p>
          </div>
        </div>
      </div>
      
      {/* Tasks section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateTasks}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate AI Tasks'}
            </button>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              {showTaskForm ? 'Cancel' : 'Add Task'}
            </button>
          </div>
        </div>
        
        {/* Task creation form */}
        {showTaskForm && (
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">Add New Task</h3>
            
            {taskFormError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{taskFormError}</p>
              </div>
            )}
            
            <form onSubmit={handleTaskFormSubmit}>
              <div className="mb-4">
                <label htmlFor="taskTitle" className="block text-gray-700 text-sm font-bold mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  name="title"
                  value={taskFormData.title}
                  onChange={handleTaskFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="What needs to be done?"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="taskDescription" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  name="description"
                  value={taskFormData.description}
                  onChange={handleTaskFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Additional details..."
                  rows="2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="taskDueDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="taskDueDate"
                    name="dueDate"
                    value={taskFormData.dueDate}
                    onChange={handleTaskFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="taskPriority" className="block text-gray-700 text-sm font-bold mb-2">
                    Priority
                  </label>
                  <select
                    id="taskPriority"
                    name="priority"
                    value={taskFormData.priority}
                    onChange={handleTaskFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="mr-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={taskFormLoading}
                  className={`${taskFormLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >
                  {taskFormLoading ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Tasks list */}
        {loading ? (
          <p className="text-center py-4">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks yet for this goal.</p>
            <p className="mt-2">Add tasks to break down your goal into manageable steps.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map(task => (
              <li key={task._id} className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggleTaskCompletion(task._id)}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Delete task"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GoalDetailPage;