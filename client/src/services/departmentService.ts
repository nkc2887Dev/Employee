import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Department {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  employee_count: number;
}

export type DepartmentInput = Omit<Department, 'id' | 'employee_count'>;

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const getAllDepartments = async (): Promise<Department[]> => {
  const response = await axios.get(`${API_URL}/departments`);
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

export const updateDepartment = async ({
  id,
  ...department
}: Department): Promise<Department> => {
  const response = await axios.put<ApiResponse<Department>>(`${API_URL}/departments/${id}`, department);
  return response.data.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/departments/${id}`);
}; 