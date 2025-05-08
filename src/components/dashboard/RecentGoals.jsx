import React from 'react';
import { Link } from 'react-router-dom';

const RecentGoals = ({ goals }) => {
  if (!Array.isArray(goals)) {
    goals = [];
  }

  // Function to format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Goals</h2>
        <Link 
          to="/goals" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="py-4 text-center text-gray-500">
          <p>No goals created yet.</p>
          <Link to="/goals/new" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Create your first goal
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {goals.map(goal => (
            <li key={goal._id} className="py-3">
              <Link to={`/goals/${goal._id}`} className="block hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${
                      goal.isCompleted ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {goal.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        goal.category === 'Personal' ? 'bg-purple-100 text-purple-800' :
                        goal.category === 'Professional' ? 'bg-blue-100 text-blue-800' :
                        goal.category === 'Health' ? 'bg-green-100 text-green-800' :
                        goal.category === 'Financial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.category}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        Due: {formatDate(goal.targetDate)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">{goal.progress}%</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentGoals;