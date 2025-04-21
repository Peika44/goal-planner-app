// components/tasks/TaskItem.jsx
import React from 'react';

const TaskItem = ({ task, onTaskComplete }) => {
  const handleCheckboxChange = (e) => {
    onTaskComplete(task._id, e.target.checked);
  };

  // Determine difficulty badge color
  let difficultyBadgeColor = 'bg-gray-100 text-gray-800';
  if (task.difficulty === 'easy') {
    difficultyBadgeColor = 'bg-green-100 text-green-800';
  } else if (task.difficulty === 'medium') {
    difficultyBadgeColor = 'bg-yellow-100 text-yellow-800';
  } else if (task.difficulty === 'hard') {
    difficultyBadgeColor = 'bg-red-100 text-red-800';
  }

  return (
    <li className="py-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
              {task.title}
            </p>
            <div className="flex space-x-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyBadgeColor}`}>
                {task.difficulty}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {task.duration} min
              </span>
            </div>
          </div>
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
              {task.description}
            </p>
          )}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;