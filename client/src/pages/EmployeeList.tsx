import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllEmployees, type Employee, type ApiResponse } from '../services/employeeService';
import { getAllDepartments } from '../services/departmentService';
import LoadingSpinner from '../components/LoadingSpinner';
import PageContainer from '../components/PageContainer';
import { formatCurrency } from '../utils/currencyUtils';
import { formatDate } from '../utils/dateUtils';
import {
  AddIcon,
  ViewIcon,
  EditIcon,
  ErrorIcon,
  EmptyIcon,
  PreviousIcon,
  NextIcon,
  DeleteIcon,
} from '../icons';

const EmployeeList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string>('');

  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments({ limit: 100 }),
  });

  const departments = departmentsData?.data || [];

  const { data, isLoading, error } = useQuery<ApiResponse<Employee[]>>({
    queryKey: ['employees', page, limit, filters],
    queryFn: () =>
      getAllEmployees({
        page,
        limit,
        status: filters.status || undefined,
        department: filters.department ? Number(filters.department) : undefined,
        search: filters.search || undefined,
      }),
  });

  const employees = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, search: value }));
      setPage(1);
    }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      setDeleteError('');
      await import('../services/employeeService').then(({ deleteEmployee }) => deleteEmployee(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      setDeleteError(
        error?.response?.data?.message || error.message || 'Failed to delete employee.',
      );
    },
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <PageContainer>
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <ErrorIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Error Loading Employees</h3>
          <p className="mt-2 text-sm text-gray-500">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </PageContainer>
    );
  }

  const addEmployeeButton = (
    <Link
      to="/employees/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <AddIcon className="-ml-1 mr-2 h-5 w-5" />
      Add Employee
    </Link>
  );

  return (
    <PageContainer title="Employees" action={addEmployeeButton}>
      {/* Filters */}
      <div className="mb-4 p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              name="search"
              value={searchInput}
              onChange={handleSearchChange}
              title="Search by name, email or department..."
              placeholder="Search name, email or department..."
              className="mt-1 block w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col p-2">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sr. No.
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Salary
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <span className="">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee: Employee, index: number) => (
                    <tr key={employee.id}>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {employee.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {employee.department_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatCurrency(employee.salary)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            employee.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                          <Link
                            to={`/employees/${employee.id}`}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <ViewIcon className="mr-1.5 h-4 w-4" />
                            View
                          </Link>
                          <Link
                            to={`/employees/${employee.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <EditIcon className="mr-1.5 h-4 w-4" />
                            Edit
                          </Link>
                          <button
                            className="inline-flex items-center text-red-600 hover:text-red-800"
                            title="Delete"
                            onClick={() => setDeleteId(employee.id)}
                          >
                            <DeleteIcon className="mr-1.5 h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length === 0 && (
                <div className="text-center py-12">
                  <EmptyIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new employee.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Confirm Delete</h3>
            <p className="mb-4 text-gray-700">Are you sure you want to delete this employee?</p>
            {deleteError && <div className="mb-2 text-red-600 text-sm">{deleteError}</div>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setDeleteId(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || !employees.length}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                    page === 1 || !employees.length
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <PreviousIcon />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    disabled={!employees.length}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === i + 1
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                    } ${!employees.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages || !employees.length}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                    page === pagination.totalPages || !employees.length
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <NextIcon />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default EmployeeList;
