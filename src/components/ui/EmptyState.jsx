import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  title, 
  message, 
  actionText, 
  actionLink, 
  icon, 
  onAction 
}) => {
  const IconComponent = icon || (
    <svg 
      className="h-12 w-12 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );

  const ActionButton = () => (
    <button
      onClick={onAction}
      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {actionText}
    </button>
  );

  const ActionLink = () => (
    <Link
      to={actionLink}
      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {actionText}
    </Link>
  );

  return (
    <div className="text-center py-8 bg-white rounded-lg shadow">
      <div className="flex justify-center mb-4">
        {typeof icon === 'function' ? icon() : IconComponent}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4 px-6">{message}</p>
      {actionText && (
        <>
          {onAction ? (
            <ActionButton />
          ) : actionLink ? (
            <ActionLink />
          ) : null}
        </>
      )}
    </div>
  );
};

// Pre-configured empty states
export const NoGoalsEmptyState = () => (
  <EmptyState
    title="No Goals Created Yet"
    message="Goals help you track progress towards your ambitions. Create your first goal to get started!"
    actionText="Create First Goal"
    actionLink="/goals/new"
    icon={() => (
      <svg className="h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
  />
);

export const NoTasksEmptyState = () => (
  <EmptyState
    title="No Tasks for Today"
    message="Great job! You've completed all your tasks for today or haven't scheduled any yet."
    actionText="Create Task"
    actionLink="/goals"
    icon={() => (
      <svg className="h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    )}
  />
);

export const NoSearchResultsEmptyState = ({ searchTerm }) => (
  <EmptyState
    title="No Results Found"
    message={`We couldn't find any results matching "${searchTerm}". Try adjusting your search terms.`}
    icon={() => (
      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )}
  />
);

export default EmptyState;