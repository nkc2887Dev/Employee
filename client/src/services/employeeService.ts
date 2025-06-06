import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  department_id: number;
  salary: number;
  status: 'active' | 'inactive';
  photo?: string;
  created_at?: string;
  modified_at?: string;
}

export interface EmployeeFilters {
  status?: string;
  department?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeResponse {
  data: Employee[];
  total: number;
}

export interface EmployeeStats {
  departmentHighestSalary: Array<{
    department: string;
    salary: number;
  }>;
  salaryRangeCount: Array<{
    range: string;
    count: number;
  }>;
  youngestByDepartment: Array<{
    department: string;
    name: string;
    age: number;
  }>;
}

export type EmployeeInput = Omit<Employee, 'id' | 'created_at' | 'modified_at'>;
export type EmployeeUpdateInput = Partial<EmployeeInput>;

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Statistics {
  totalEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  departmentStats: Array<{
    id: number;
    name: string;
    employeeCount: number;
    averageSalary: number;
  }>;
}

export const getAllEmployees = async (): Promise<Employee[]> => {
  const response = await axios.get<ApiResponse<Employee[]>>(`${API_URL}/employees`);
  return response.data.data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await axios.get<ApiResponse<Employee>>(`${API_URL}/employees/${id}`);
  return response.data.data;
};

export const createEmployee = async (employee: EmployeeInput): Promise<Employee> => {
  const response = await axios.post<ApiResponse<Employee>>(`${API_URL}/employees`, employee);
  return response.data.data;
};

export const updateEmployee = async ({
  id,
  ...employee
}: EmployeeUpdateInput & { id: number }): Promise<Employee> => {
  const response = await axios.put<ApiResponse<Employee>>(`${API_URL}/employees/${id}`, employee);
  return response.data.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/employees/${id}`);
};

export const getStatistics = async (): Promise<Statistics> => {
  const response = await axios.get(`${API_URL}/statistics`);
  return response.data;
};

export const getEmployeeStats = async (): Promise<EmployeeStats> => {
  const response = await axios.get(`${API_URL}/employees/stats`);
  return response.data;
};

const employeeService = {
  getAll: async (filters: EmployeeFilters): Promise<EmployeeResponse> => {
    const response = await axios.get(`${API_URL}/employees`, { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await axios.get(`${API_URL}/employees/${id}`);
    return response.data;
  },

  getStats: async (): Promise<EmployeeStats> => {
    const response = await axios.get(`${API_URL}/employees/stats`);
    return response.data;
  },
};

export default employeeService; 