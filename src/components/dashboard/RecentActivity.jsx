import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getRelativeTimeString } from '../../utils/dateUtils';

const RecentActivity = ({ goals }) => {
  // Create activity items from goals and their tasks
  const generateActivityItems = () => {
    const activities = [];

    // Add goal creation events
    goals.forEach(goal => {
      activities.push({
        type: 'goal_created',
        goal,
        date: new Date(goal.createdAt),
        id: `goal_created_${goal._id}`
      });

      // Add task completion events
      if (goal.tasks) {
        goal.tasks
          .filter(task => task.completed && task.completedAt)
          .forEach(task => {
            activities.push({
              type: 'task_completed',
              goal,
              task,
              date: new Date(task.completedAt),
              id: `task_completed_${task._id}`
            });
          });
      }

      // Add goal completion events
      if (goal.completed && goal.completedAt) {
        activities.push({
          type: 'goal_completed',
          goal,
          date: new Date(goal.completedAt),
          id: `goal_completed_${goal._id}`
        });
      }
    });

    // Sort activities by date
    activities.sort((a, b) => b.date - a.date);
    return activities;
  };

  const activities = generateActivityItems();

  const renderActivityItem = (activity) => {
    switch (activity.type) {
      case 'goal_created':
        return (
          <div key={activity.id} className="p-3 border-b">
            <p><strong>New goal created:</strong> <Link to={`/goals/${activity.goal._id}`}>{activity.goal.title}</Link></p>
            <p className="text-sm text-gray-500">{getRelativeTimeString(activity.date)} ({formatDate(activity.date)})</p>
          </div>
        );
      case 'task_completed':
        return (
          <div key={activity.id} className="p-3 border-b">
            <p><strong>Task completed:</strong> <span>{activity.task.title}</span> in goal <Link to={`/goals/${activity.goal._id}`}>{activity.goal.title}</Link></p>
            <p className="text-sm text-gray-500">{getRelativeTimeString(activity.date)} ({formatDate(activity.date)})</p>
          </div>
        );
      case 'goal_completed':
        return (
          <div key={activity.id} className="p-3 border-b">
            <p><strong>Goal completed:</strong> <Link to={`/goals/${activity.goal._id}`}>{activity.goal.title}</Link></p>
            <p className="text-sm text-gray-500">{getRelativeTimeString(activity.date)} ({formatDate(activity.date)})</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-lg font-semibold p-4 border-b">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="p-4 text-gray-500">No recent activity yet.</p>
      ) : (
        <div>
          {activities.map(activity => renderActivityItem(activity))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
