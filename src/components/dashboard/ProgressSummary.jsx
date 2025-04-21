// components/dashboard/ProgressSummary.jsx
import React from 'react';

const ProgressSummary = ({ goals }) => {
  // Calculate overall statistics
  const totalGoals = goals.length;
  const activeGoals = goals.filter(goal => !goal.completed).length;
  const completedGoals = goals.filter(goal => goal.completed).length;
  
  // Calculate total tasks statistics across all goals
  const allTasks = goals.flatMap(goal => goal.tasks || []);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const stats = [
    { name: 'Active Goals', value: activeGoals },
    { name: 'Completed Goals', value: completedGoals },
    { name: 'Completion Rate', value: `${completionRate}%` },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Summary</h3>
      
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProgressSummary;