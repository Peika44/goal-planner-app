// pages/NewGoalPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import axios from '../api/axios';

const NewGoalPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timeframe: 'month',
    category: 'personal',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call API to generate AI plan
      const response = await axios.post('/goals/generate-plan', formData);
      setGeneratedPlan(response.data.plan);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Save goal with the generated plan
      await axios.post('/goals', {
        ...formData,
        plan: generatedPlan
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setStep(1);
    setGeneratedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Goal</h1>

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

              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Generating Plan...' : 'Generate AI Plan'}
              </button>
            </form>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Generated Plan for "{formData.name}"
                </h2>
                <p className="text-gray-600 mb-4">
                  Here's an AI-generated plan to help you achieve your goal. Review it and make any adjustments if needed.
                </p>

                <div className="bg-gray-50 rounded-md p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Milestones</h3>
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
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Sample Tasks</h3>
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
                  onClick={handleRegenerate}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Regenerate Plan
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Goal'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewGoalPage;