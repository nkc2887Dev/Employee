import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
import departmentReducer from './slices/departmentSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    departments: departmentReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
