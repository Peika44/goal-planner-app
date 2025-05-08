import React from 'react';

const ProgressSummary = ({ goals }) => {
  // Check if goals is an array before using array methods
  if (!Array.isArray(goals)) {
    return (
      <div className="progress-summary bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Goals Progress</h2>
        <p>Loading goals data...</p>
      </div>
    );
  }

  // Only execute this code if goals is an array
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const activeGoals = totalGoals - completedGoals;
  
  // Calculate completion percentage
  const completionPercentage = totalGoals === 0 
    ? 0 
    : Math.round((completedGoals / totalGoals) * 100);

  return (
    <div className="progress-summary bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Goals Progress</h2>
      <div className="flex justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-600">Total Goals</p>
          <p className="text-2xl font-bold">{totalGoals}</p>
        </div>
        <div className="flex-1">
          <p className="text-gray-600">Active</p>
          <p className="text-2xl font-bold text-blue-600">{activeGoals}</p>
        </div>
        <div className="flex-1">
          <p className="text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
        </div>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-green-600">
              {completionPercentage}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
          <div style={{ width: `${completionPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;