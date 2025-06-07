import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployeeStats } from '../../services/employeeService';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageContainer from '../../components/PageContainer';
import DepartmentSalaryStats from './DepartmentSalaryStats';
import { ErrorIcon } from '../../icons';

const DepartmentSalaryPage: React.FC = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['employeeStats'],
    queryFn: getEmployeeStats,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <PageContainer>
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <ErrorIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Error Loading Statistics</h3>
          <p className="mt-2 text-sm text-gray-500">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Department-wise Highest Salary">
      <DepartmentSalaryStats data={stats?.departmentHighestSalary || []} />
    </PageContainer>
  );
};

export default DepartmentSalaryPage;
