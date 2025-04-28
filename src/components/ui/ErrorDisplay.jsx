import React from 'react';

const ErrorDisplay = ({ message, onRetry, inline = false }) => {
  if (inline) {
    return (
      <div className="rounded-md bg-red-50 p-3 my-2">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{message}</p>
          </div>
          {onRetry && (
            <div className="ml-auto">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p>{message}</p>
        </div>
        {onRetry && (
          <button 
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={onRetry}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;