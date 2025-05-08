// components/common/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium', 
  isLoading = false, 
  disabled = false, 
  fullWidth = false,
  onClick,
  className = '', 
  ...rest 
}) => {
  // Define base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors duration-200';
  
  // Size variations
  const sizeStyles = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'border border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    secondary: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    success: 'border border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
    danger: 'border border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    outline: 'border border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
  };
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Disabled and loading styles
  const stateStyles = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${stateStyles} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;