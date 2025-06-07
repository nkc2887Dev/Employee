import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployeeById,
  createEmployee,
  updateEmployee,
  type EmployeeInput,
  type EmployeeUpdateInput,
} from '../services/employeeService';
import {
  getAllDepartments,
  type Department,
  type PaginatedResponse,
} from '../services/departmentService';
import type { ApiError } from '../types/error';

const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [error, setError] = useState<string>('');

  const { data: employee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id!),
    enabled: isEditing,
  });

  const { data: departmentsResponse, isLoading: isLoadingDepartments } = useQuery<
    PaginatedResponse<Department>
  >({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments({ page: 1, limit: 100 }), // Get all departments for the dropdown
  });

  const departments = departmentsResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    },
    onError: (error: ApiError) => {
      console.error('Error creating employee:', error);
      setError(
        error.response?.data?.message ||
          error.message ||
          'Failed to create employee. Please check your input.',
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      navigate('/employees');
    },
    onError: (error: ApiError) => {
      console.error('Error updating employee:', error);
      setError(
        error.response?.data?.message ||
          error.message ||
          'Failed to update employee. Please check your input.',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);

    if (isEditing && id) {
      const updateData: EmployeeUpdateInput = {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        dob: formData.get('dob') as string,
        department_id: Number(formData.get('department_id')),
        salary: Number(formData.get('salary')),
        status: formData.get('status') as 'active' | 'inactive',
      };

      // Only include photo if it's provided
      const photo = formData.get('photo') as string;
      if (photo) {
        updateData.photo = photo;
      }

      // Validate required fields
      if (
        !updateData.name ||
        !updateData.phone ||
        !updateData.dob ||
        !updateData.department_id ||
        !updateData.salary ||
        !updateData.status
      ) {
        setError('Please fill in all required fields');
        return;
      }

      updateMutation.mutate({ id: Number(id), ...updateData });
    } else {
      const createData: EmployeeInput = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        dob: formData.get('dob') as string,
        department_id: Number(formData.get('department_id')),
        salary: Number(formData.get('salary')),
        status: formData.get('status') as 'active' | 'inactive',
        photo: (formData.get('photo') as string) || undefined,
      };

      // Validate required fields
      if (
        !createData.name ||
        !createData.email ||
        !createData.phone ||
        !createData.dob ||
        !createData.department_id ||
        !createData.salary ||
        !createData.status
      ) {
        setError('Please fill in all required fields');
        return;
      }

      createMutation.mutate(createData);
    }
  };

  if ((isEditing && isLoadingEmployee) || isLoadingDepartments) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Employee' : 'Add Employee'}
        </h2>
        {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}
        {(createMutation.isError || updateMutation.isError) && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {createMutation.error?.message || updateMutation.error?.message || 'An error occurred'}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={employee?.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={employee?.email}
              required
              disabled={isEditing}
              readOnly={isEditing}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              pattern="^\+?[1-9]\d{1,14}$"
              title="Phone number must start with + followed by 1-15 digits"
              defaultValue={employee?.phone}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              id="dob"
              defaultValue={employee?.dob?.split('T')[0]}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="department_id" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department_id"
              id="department_id"
              defaultValue={employee?.department_id}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              type="number"
              name="salary"
              id="salary"
              defaultValue={employee?.salary}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              id="status"
              defaultValue={employee?.status || 'active'}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Photo URL
            </label>
            <input
              type="text"
              name="photo"
              id="photo"
              defaultValue={employee?.photo}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
