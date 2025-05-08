import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  // Get today's date in YYYY-MM-DD format for the date input min value
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Create New Goal</h1>
        <Link to="/goals" className="dashboard-button dashboard-button-small dashboard-button-secondary">
          <svg className="dashboard-icon dashboard-icon-small" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Goals
        </Link>
      </div>
      
      {/* Content Panel with frosted glass effect */}
      <div className="dashboard-panel">
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
        
        <div className="dashboard-create-goal-form">
          <form onSubmit={handleSubmit}>
            <div className="dashboard-form-group">
              <label htmlFor="title" className="dashboard-form-label">
                Goal Title <span className="dashboard-form-required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="dashboard-form-input"
                placeholder="Enter a clear, concise title for your goal"
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
                value={formData.description}
                onChange={handleChange}
                className="dashboard-form-input dashboard-form-textarea"
                placeholder="Describe your goal in detail - what you want to achieve and why"
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
                  value={formData.category}
                  onChange={handleChange}
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
                  value={formData.priority}
                  onChange={handleChange}
                  className="dashboard-form-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            
            <div className="dashboard-form-group">
              <label htmlFor="targetDate" className="dashboard-form-label">
                Target Date <span className="dashboard-form-required">*</span>
              </label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="dashboard-form-input"
                min={today}
                required
              />
            </div>
            
            <div className="dashboard-form-group dashboard-ai-option">
              <div className="dashboard-ai-checkbox">
                <input
                  type="checkbox"
                  id="useAI"
                  checked={useAI}
                  onChange={() => setUseAI(!useAI)}
                  className="dashboard-checkbox"
                />
                <label htmlFor="useAI" className="dashboard-checkbox-label dashboard-ai-label">
                  <svg className="dashboard-ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
                  </svg>
                </label>
                <span className="dashboard-ai-text">
                  Use AI to help create tasks for this goal
                </span>
              </div>
              <p className="dashboard-ai-description">
                Our AI will analyze your goal and suggest a structured plan with tasks to help you achieve it
              </p>
            </div>
            
            <div className="dashboard-form-actions">
              <button
                type="button"
                onClick={() => navigate('/goals')}
                className="dashboard-button dashboard-button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="dashboard-button"
              >
                {loading ? (
                  <>
                    <svg className="dashboard-icon dashboard-icon-spin" viewBox="0 0 24 24">
                      <circle className="dashboard-icon-loader-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                      <path className="dashboard-icon-loader" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Goal</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGoalPage;