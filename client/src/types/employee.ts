export interface Employee {
  id: number;
  department_id: number;
  department_name: string;
  name: string;
  dob: string;
  phone: string;
  photo?: string;
  email: string;
  salary: number;
  status: 'active' | 'inactive';
  created_at: string;
  modified_at: string;
}
