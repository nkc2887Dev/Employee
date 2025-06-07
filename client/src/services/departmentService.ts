import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Department {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  employee_count: number;
}

export interface DepartmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type DepartmentInput = Omit<Department, 'id' | 'employee_count'>;

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const getAllDepartments = async (
  filters: DepartmentFilters = {},
): Promise<PaginatedResponse<Department>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const response = await axios.get(`${API_URL}/departments?${params.toString()}`);
  return response.data;
};

export const getDepartmentById = async (id: string): Promise<Department> => {
  const response = await axios.get<ApiResponse<Department>>(`${API_URL}/departments/${id}`);
  return response.data.data;
};

export const createDepartment = async (department: DepartmentInput): Promise<Department> => {
  const response = await axios.post<ApiResponse<Department>>(`${API_URL}/departments`, department);
  return response.data.data;
};

export const updateDepartment = async ({ id, ...department }: Department): Promise<Department> => {
  const response = await axios.put<ApiResponse<Department>>(
    `${API_URL}/departments/${id}`,
    department,
  );
  return response.data.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/departments/${id}`);
};
