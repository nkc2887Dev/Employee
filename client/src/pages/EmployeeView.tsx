import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEmployeeById } from '../services/employeeService';
import { getDepartmentById } from '../services/departmentService';

const EmployeeView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: employee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id!),
    enabled: Boolean(id),
  });

  const { data: department, isLoading: isLoadingDepartment } = useQuery({
    queryKey: ['department', employee?.department_id],
    queryFn: () => getDepartmentById(String(employee?.department_id)),
    enabled: Boolean(employee?.department_id),
  });

  if (isLoadingEmployee || isLoadingDepartment) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
        Error loading employee details
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
          <div className="space-x-3">
            <button
              onClick={() => navigate(`/employees/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => navigate('/employees')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to List
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee.email}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee.phone}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900">{department?.name || 'Loading...'}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(employee.dob).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Salary</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(employee.salary)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </span>
              </dd>
            </div>

            {employee.photo && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Photo</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <img
                    src={employee.photo}
                    alt={employee.name}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
