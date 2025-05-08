// components/common/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'bg-gray-100 text-gray-500' : ''} ${className}`}
        {...rest}
      />
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;