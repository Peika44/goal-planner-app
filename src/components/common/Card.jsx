// components/common/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  footer,
  className = '',
  contentClassName = '',
  onClick,
  ...rest 
}) => {
  return (
    <div 
      className={`bg-white shadow-md rounded-lg overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className={`p-6 ${contentClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;