// components/goals/GoalForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoals } from '../../hooks/useGoals';
import { formatCategory, formatTimeframe } from '../../utils/formatUtils';

const GoalForm = ({ isEditing = false, initialData = null }) => {
  const navigate = useNavigate();
  const { goalId } = useParams();
  const { createGoal, updateGoal, getGoalById, generatePlan } = useGoals();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timeframe: 'month',
    category: 'personal'
  });
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  
  useEffect(() => {
    // If editing mode, fetch goal data
    const fetchGoalData = async () => {
      if (isEditing && goalId) {
        setIsLoading(true);
        const goalData = await getGoalById(goalId);
        
        if (goalData) {
          setFormData({
            name: goalData.name,
            description: goalData.description,
            timeframe: goalData.timeframe,
            category: goalData.category
          });
          
          if (goalData.plan) {
            setGeneratedPlan(goalData.plan);
          }
        } else {
          setError('Failed to load goal data');
        }
        
        setIsLoading(false);
      } else if (initialData) {
        // Use provided initialData if available
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          timeframe: initialData.timeframe || 'month',
          category: initialData.category || 'personal'
        });
        
        if (initialData.plan) {
          setGeneratedPlan(initialData.plan);
          setStep(2);
        }
      }
    };
    
    fetchGoalData();
  }, [isEditing, goalId, getGoalById, initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const plan = await generatePlan(formData);
      
      if (plan) {
        setGeneratedPlan(plan);
        setStep(2);
      } else {
        setError('Failed to generate plan. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while generating the plan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveGoal = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (isEditing && goalId) {
        // Update existing goal
        const updatedGoal = await updateGoal(goalId, {
          ...formData,
          plan: generatedPlan
        });
        
        if (updatedGoal) {
          navigate(`/goals/${goalId}`);
        } else {
          setError('Failed to update goal');
        }
      } else {
        // Create new goal
        const newGoal = await createGoal({
          ...formData,
          plan: generatedPlan
        });
        
        if (newGoal) {
          navigate(`/goals/${newGoal._id}`);
        } else {
          setError('Failed to create goal');
        }
      }
    } catch (err) {
      setError('An error occurred while saving the goal');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    setStep(1);
  };
  
  const handleCancel = () => {
    if (isEditing && goalId) {
      navigate(`/goals/${goalId}`);
    } else {
      navigate('/dashboard');
    }
  };
  
  if (isLoading && step === 1) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading goal data...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Goal' : 'Create New Goal'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {step === 1 ? (
        <form onSubmit={handleGeneratePlan}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="E.g., Learn Spanish, Run a marathon"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your goal in detail. What do you want to achieve and why?"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                Timeframe
              </label>
              <select
                id="timeframe"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="week">1 Week</option>
                <option value="month">1 Month</option>
                <option value="quarter">3 Months</option>
                <option value="halfYear">6 Months</option>
                <option value="year">1 Year</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="personal">Personal Development</option>
                <option value="professional">Professional</option>
                <option value="health">Health & Fitness</option>
                <option value="education">Education</option>
                <option value="finance">Financial</option>
                <option value="social">Social & Relationships</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate AI Plan'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generated Plan for "{formData.name}"
            </h3>
            <p className="text-gray-600 mb-4">
              Here's an AI-generated plan to help you achieve your goal within {formatTimeframe(formData.timeframe)}.
              Review it and make any adjustments if needed.
            </p>
            
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Milestones</h4>
              <ul className="space-y-3">
                {generatedPlan.milestones.map((milestone, index) => (
                  <li key={index} className="bg-white rounded p-3 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span className="font-medium">{milestone.title}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 ml-9">{milestone.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Sample Tasks</h4>
              <ul className="space-y-2">
                {generatedPlan.sampleTasks.map((task, index) => (
                  <li key={index} className="flex items-center">
                    <span className="h-2 w-2 bg-blue-600 rounded-full mr-2"></span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSaveGoal}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update Goal' : 'Save Goal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalForm;