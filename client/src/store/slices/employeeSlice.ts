import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Employee {
  id: number;
  department_id: number;
  name: string;
  dob: string;
  phone: string;
  photo: string;
  email: string;
  salary: number;
  status: 'active' | 'inactive';
  created_at: string;
  modified_at: string;
}

interface EmployeeState {
  selectedEmployee: Employee | null;
  filters: {
    status: string;
    department: number | null;
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: EmployeeState = {
  selectedEmployee: null,
  filters: {
    status: 'active',
    department: null,
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setSelectedEmployee, setFilters, setPagination, resetFilters } =
  employeeSlice.actions;

export default employeeSlice.reducer;
