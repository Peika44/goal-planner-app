// components/dashboard/UpcomingTasks.jsx (Enhanced version)
import React from 'react';
import { Link } from 'react-router-dom';

const UpcomingTasks = ({ tasks, onCompleteTask, expanded = false }) => {
  // Determine difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckboxChange = (taskId, checked) => {
    if (onCompleteTask) {
      onCompleteTask(taskId, checked);
    }
  };

  return (
    <div>
      {tasks && tasks.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task._id} className="py-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => handleCheckboxChange(task._id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.title}
                    </p>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {task.duration} min
                      </span>
                    </div>
                  </div>
                  
                  {(task.description && expanded) && (
                    <p className={`mt-1 text-xs ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                      {task.description}
                    </p>
                  )}
                  
                  {task.goalId && expanded && (
                    <div className="mt-1 text-xs text-gray-500">
                      Goal: <Link to={`/goals/${task.goalId}`} className="text-blue-600 hover:underline">{task.goalName}</Link>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No tasks scheduled for today</p>
          <Link
            to="/goals"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Add tasks from your goals
          </Link>
        </div>
      )}
      
      <button 
        className="mt-4 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
        onClick={() => {}} // Will connect to task generation function
      >
        Generate New Tasks
      </button>
    </div>
  );
};

export default UpcomingTasks;