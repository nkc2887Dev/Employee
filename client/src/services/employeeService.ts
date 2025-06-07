import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  department_id: number;
  department_name?: string;
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

export interface EmployeeInput {
  name: string;
  email: string;
  phone: string;
  dob: string;
  department_id: number;
  salary: number;
  status: 'active' | 'inactive';
  photo?: string;
}

export interface EmployeeUpdateInput extends Partial<Omit<EmployeeInput, 'email'>> {}

export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
  department?: number;
  search?: string;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: PaginationResponse;
}

export const getAllEmployees = async (
  params?: PaginationParams,
): Promise<ApiResponse<Employee[]>> => {
  const response = await axios.get<ApiResponse<Employee[]>>(`${API_URL}/employees`, {
    params,
  });
  return response.data;
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
