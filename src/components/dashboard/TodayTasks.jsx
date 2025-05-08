import React from 'react';
import { Link } from 'react-router-dom';

const TodayTasks = ({ tasks }) => {
  if (!Array.isArray(tasks)) {
    tasks = [];
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Tasks</h2>
        <Link 
          to="/tasks" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="py-4 text-center text-gray-500">
          <p>No tasks scheduled for today.</p>
          <Link to="/goals" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Create new tasks
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasks.map(task => (
            <li key={task._id} className="py-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  readOnly
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${
                    task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </p>
                  {task.goal && (
                    <p className="text-xs text-gray-500">
                      Goal: {typeof task.goal === 'object' ? task.goal.title : 'Unknown Goal'}
                    </p>
                  )}
                </div>
                <div className={`ml-2 px-2 py-1 text-xs rounded ${
                  task.priority === 'High' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodayTasks;