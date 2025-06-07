const ROUTES = {
  HOME: '/',
  EMPLOYEES: '/employees',
  EMPLOYEE_NEW: '/employees/new',
  EMPLOYEE_VIEW: (id = ':id') => `/employees/${id}`,
  EMPLOYEE_EDIT: (id = ':id') => `/employees/${id}/edit`,

  DEPARTMENTS: '/departments',
  DEPARTMENT_NEW: '/departments/new',
  DEPARTMENT_VIEW: (id = ':id') => `/departments/${id}`,
  DEPARTMENT_EDIT: (id = ':id') => `/departments/${id}/edit`,

  STATISTICS: '/statistics',
  STATISTICS_DEPARTMENT_SALARIES: '/statistics/department-salaries',
  STATISTICS_SALARY_RANGES: '/statistics/salary-ranges',
  STATISTICS_YOUNGEST_EMPLOYEES: '/statistics/youngest-employees',

  NOT_FOUND: '*',
};

export default ROUTES;
