import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title, action }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {(title || action) && (
        <div className="mb-8 flex justify-between items-center">
          {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default PageContainer; 