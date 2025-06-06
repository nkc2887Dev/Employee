import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-400 border-t-transparent"></div>
        <div className="mt-4 text-center text-gray-600">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 