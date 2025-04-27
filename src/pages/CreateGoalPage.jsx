import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGoal, generatePlan } from '../api/goalApi';

const CreateGoalPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    targetDate: '',
    priority: 'Medium'
  });
  
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.targetDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      if (useAI) {
        // Use AI to generate a plan for the goal
        response = await generatePlan(formData);
        
        if (response.success) {
          // Create the goal with the generated plan
          const goalResponse = await createGoal(response.data);
          
          if (goalResponse.success) {
            navigate(`/goals/${goalResponse.data._id}`);
          } else {
            setError(goalResponse.error || 'Failed to create goal');
          }
        } else {
          setError(response.error || 'Failed to generate plan');
        }
      } else {
        // Create goal directly
        response = await createGoal(formData);
        
        if (response.success) {
          navigate(`/goals/${response.data._id}`);
        } else {
          setError(response.error || 'Failed to create goal');
        }
      }
    } catch (err) {
      console.error('Create goal error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Goal</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Goal Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter a clear, concise title for your goal"
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
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Describe your goal in detail - what you want to achieve and why"
            rows="4"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
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
              value={formData.priority}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="targetDate" className="block text-gray-700 text-sm font-bold mb-2">
            Target Date *
          </label>
          <input
            type="date"
            id="targetDate"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useAI"
              checked={useAI}
              onChange={() => setUseAI(!useAI)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="useAI" className="ml-2 block text-gray-700">
              Use AI to help create tasks for this goal
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Our AI will analyze your goal and suggest a structured plan with tasks to help you achieve it
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/goals')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {loading ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGoalPage;