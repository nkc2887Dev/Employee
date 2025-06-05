import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Department {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
  modified_at: string;
}

interface DepartmentState {
  selectedDepartment: Department | null;
  filters: {
    status: string;
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: DepartmentState = {
  selectedDepartment: null,
  filters: {
    status: 'active',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setSelectedDepartment: (state, action: PayloadAction<Department | null>) => {
      state.selectedDepartment = action.payload;
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

export const { setSelectedDepartment, setFilters, setPagination, resetFilters } = departmentSlice.actions;

export default departmentSlice.reducer; 