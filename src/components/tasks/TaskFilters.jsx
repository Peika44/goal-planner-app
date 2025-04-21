// components/tasks/TaskFilters.jsx
import React from 'react';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-gray-50 rounded-md p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Tasks</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="difficulty" className="block text-xs font-medium text-gray-500 mb-1">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={filters.difficulty}
            onChange={handleChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-xs font-medium text-gray-500 mb-1">
            Duration
          </label>
          <select
            id="duration"
            name="duration"
            value={filters.duration}
            onChange={handleChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any Duration</option>
            <option value="quick">Quick (&lt; 15 min)</option>
            <option value="medium">Medium (15-30 min)</option>
            <option value="long">Long (&gt; 30 min)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-500 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;