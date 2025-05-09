import React, { useState, useEffect, createContext, useContext } from 'react';

// Toast context
const ToastContext = createContext();

// Toast types with corresponding styles
const TOAST_TYPES = {
  SUCCESS: {
    bgColor: 'bg-green-500',
    icon: (
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  ERROR: {
    bgColor: 'bg-red-500',
    icon: (
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  },
  INFO: {
    bgColor: 'bg-blue-500',
    icon: (
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  },
  WARNING: {
    bgColor: 'bg-yellow-500',
    icon: (
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  }
};

// Individual toast component
const ToastItem = ({ id, message, type, onDismiss, autoClose = true }) => {
  const toastType = TOAST_TYPES[type] || TOAST_TYPES.INFO;
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [id, onDismiss, autoClose]);
  
  return (
    <div 
      className={`${toastType.bgColor} text-white p-3 rounded-md shadow-lg flex items-center justify-between mb-2 transform transition-all duration-300 ease-in-out translate-x-0 opacity-100`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-2">
          {toastType.icon}
        </div>
        <div className="mr-8 text-sm font-medium">{message}</div>
      </div>
      <button 
        onClick={() => onDismiss(id)} 
        className="text-white focus:outline-none"
        aria-label="Close"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

// Toast container
const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-72">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={onDismiss}
          autoClose={toast.autoClose}
        />
      ))}
    </div>
  );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Add a new toast
  const addToast = (message, type = 'INFO', autoClose = true) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, autoClose }]);
    return id;
  };
  
  // Remove a toast by id
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Convenience methods
  const success = (message, autoClose = true) => addToast(message, 'SUCCESS', autoClose);
  const error = (message, autoClose = true) => addToast(message, 'ERROR', autoClose);
  const info = (message, autoClose = true) => addToast(message, 'INFO', autoClose);
  const warning = (message, autoClose = true) => addToast(message, 'WARNING', autoClose);
  
  // Context value
  const value = {
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};