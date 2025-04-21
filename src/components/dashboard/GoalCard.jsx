// components/dashboard/GoalCard.jsx (Enhanced version)
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

const GoalCard = ({ goal, compact = false }) => {
  // Calculate progress percentage
  const completedTasks = goal.tasks?.filter(task => task.completed).length || 0;
  const totalTasks = goal.tasks?.length || 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Format dates for display
  const createdDate = formatDate(goal.createdAt);

  // Determine category badge color
  let categoryColor = 'bg-blue-100 text-blue-800';
  if (goal.category === 'health') {
    categoryColor = 'bg-green-100 text-green-800';
  } else if (goal.category === 'professional') {
    categoryColor = 'bg-purple-100 text-purple-800';
  } else if (goal.category === 'education') {
    categoryColor = 'bg-yellow-100 text-yellow-800';
  } else if (goal.category === 'finance') {
    categoryColor = 'bg-indigo-100 text-indigo-800';
  } else if (goal.category === 'social') {
    categoryColor = 'bg-pink-100 text-pink-800';
  }

  if (compact) {
    // Compact version for dashboard
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">{goal.name}</h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
                {goal.category}
              </span>
              <span className="text-xs text-gray-500">Created: {createdDate}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-gray-700">{progressPercentage}%</span>
            <div className="mt-2 w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">{completedTasks}/{totalTasks} tasks</div>
          <Link 
            to={`/goals/${goal._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }

  // Full version for goals page
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
          {goal.category}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{goal.description}</p>
      
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          {completedTasks}/{totalTasks} tasks completed
        </div>
        <Link 
          to={`/goals/${goal._id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default GoalCard;