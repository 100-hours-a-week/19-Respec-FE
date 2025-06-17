import React from 'react';

const LoadingIndicator = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    blue: 'border-blue-500 border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    red: 'border-red-500 border-t-transparent',
    green: 'border-green-500 border-t-transparent',
  };

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={spinnerClass}></div>
    </div>
  );
};

export const PageLoadingIndicator = ({ className = '' }) => (
  <LoadingIndicator size="md" color="blue" className={`py-4 ${className}`} />
);

export const ButtonLoadingIndicator = ({ className = '' }) => (
  <LoadingIndicator size="sm" color="white" className={className} />
);

export const InlineLoadingIndicator = ({ className = '' }) => (
  <LoadingIndicator size="xs" color="blue" className={className} />
);

export default LoadingIndicator;
