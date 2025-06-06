import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDepartmentById } from '../services/departmentService';

const DepartmentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: department, isLoading, error } = useQuery({
    queryKey: ['department', id],
    queryFn: () => getDepartmentById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !department) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
        Error loading department details
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Department Details</h2>
          <div className="space-x-3">
            <button
              onClick={() => navigate(`/departments/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => navigate('/departments')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to List
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{department.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    department.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Employee Count</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600 mr-2">
                    {department.employee_count}
                  </span>
                  <span className="text-gray-600">
                    {department.employee_count === 1 ? 'employee' : 'employees'}
                  </span>
                </div>
              </dd>
            </div>

            <div className="sm:col-span-2 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:space-x-4">
                <button
                  onClick={() => navigate('/employees/new')}
                  className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add New Employee
                </button>
                <button
                  onClick={() => navigate('/employees')}
                  className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View All Employees
                </button>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DepartmentView; 