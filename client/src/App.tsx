import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import Layout from './components/Layout';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeView from './pages/EmployeeView';
import DepartmentList from './pages/DepartmentList';
import DepartmentForm from './pages/DepartmentForm';
import DepartmentView from './pages/DepartmentView';
import DepartmentSalaryPage from './pages/statistics/DepartmentSalaryPage';
import SalaryRangePage from './pages/statistics/SalaryRangePage';
import YoungestEmployeePage from './pages/statistics/YoungestEmployeePage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/employees" replace />} />

              {/* Employee Routes */}
              <Route path="/employees">
                <Route index element={<EmployeeList />} />
                <Route path="new" element={<EmployeeForm />} />
                <Route path=":id" element={<EmployeeView />} />
                <Route path=":id/edit" element={<EmployeeForm />} />
              </Route>

              {/* Department Routes */}
              <Route path="/departments">
                <Route index element={<DepartmentList />} />
                <Route path="new" element={<DepartmentForm />} />
                <Route path=":id" element={<DepartmentView />} />
                <Route path=":id/edit" element={<DepartmentForm />} />
              </Route>

              {/* Statistics Routes */}
              <Route path="/statistics">
                <Route path="department-salaries" element={<DepartmentSalaryPage />} />
                <Route path="salary-ranges" element={<SalaryRangePage />} />
                <Route path="youngest-employees" element={<YoungestEmployeePage />} />
                <Route index element={<Navigate to="/statistics/department-salaries" replace />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
