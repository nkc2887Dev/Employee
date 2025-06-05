import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Department {
  id: number;
  name: string;
  description: string;
  employeeCount?: number;
}

export type DepartmentInput = Omit<Department, 'id' | 'employeeCount'>;

export const getAllDepartments = async (): Promise<Department[]> => {
  const response = await axios.get(`${API_URL}/departments`);
  return response.data;
};

export const getDepartmentById = async (id: string): Promise<Department> => {
  const response = await axios.get(`${API_URL}/departments/${id}`);
  return response.data;
};

export const createDepartment = async (department: DepartmentInput): Promise<Department> => {
  const response = await axios.post(`${API_URL}/departments`, department);
  return response.data;
};

export const updateDepartment = async ({
  id,
  ...department
}: DepartmentInput & { id: number }): Promise<Department> => {
  const response = await axios.put(`${API_URL}/departments/${id}`, department);
  return response.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/departments/${id}`);
}; 