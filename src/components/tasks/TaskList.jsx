// components/tasks/TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onTaskComplete, filters }) => {
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    if (filters.difficulty && task.difficulty !== filters.difficulty) return false;
    
    if (filters.duration) {
      const duration = parseInt(task.duration, 10);
      if (filters.duration === 'quick' && duration >= 15) return false;
      if (filters.duration === 'medium' && (duration < 15 || duration > 30)) return false;
      if (filters.duration === 'long' && duration <= 30) return false;
    }
    
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.status === 'pending' && task.completed) return false;
    
    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks match your filters</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {filteredTasks.map((task) => (
        <TaskItem 
          key={task._id} 
          task={task} 
          onTaskComplete={onTaskComplete} 
        />
      ))}
    </ul>
  );
};

export default TaskList;