export interface Department {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
  modified_at: string;
}

export interface DepartmentFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
} 