import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

const NotFound: React.FC = () => {
  return (
    <PageContainer>
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back home
        </Link>
      </div>
    </PageContainer>
  );
};

export default NotFound; 