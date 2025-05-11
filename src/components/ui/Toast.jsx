// src/components/ui/Toast.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Create context for the toast
const ToastContext = createContext();

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Custom hook to access the toast functionality
 * @returns {Object} Toast methods
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Individual Toast component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Toast component
 */
const Toast = ({ id, type, message, duration, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  // Define icon based on toast type
  const renderIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return (
          <svg className="toast-icon" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case TOAST_TYPES.ERROR:
        return (
          <svg className="toast-icon" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case TOAST_TYPES.WARNING:
        return (
          <svg className="toast-icon" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return (
          <svg className="toast-icon" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      {renderIcon()}
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={() => onClose(id)}>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

/**
 * Toast provider component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Toast provider
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remove a toast by ID
  const closeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Add a new toast
  const addToast = useCallback(
    (type, message, duration = 5000) => {
      const id = Date.now().toString();
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, type, message, duration },
      ]);
      return id;
    },
    []
  );

  // Convenience methods for different toast types
  const success = useCallback(
    (message, duration) => addToast(TOAST_TYPES.SUCCESS, message, duration),
    [addToast]
  );

  const error = useCallback(
    (message, duration) => addToast(TOAST_TYPES.ERROR, message, duration),
    [addToast]
  );

  const warning = useCallback(
    (message, duration) => addToast(TOAST_TYPES.WARNING, message, duration),
    [addToast]
  );

  const info = useCallback(
    (message, duration) => addToast(TOAST_TYPES.INFO, message, duration),
    [addToast]
  );

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    addToast,
    success,
    error,
    warning,
    info,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={closeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;