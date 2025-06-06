import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import MainLayout from './layouts/MainLayout';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeView from './pages/EmployeeView';
import DepartmentList from './pages/DepartmentList';
import DepartmentForm from './pages/DepartmentForm';
import DepartmentView from './pages/DepartmentView';
import Statistics from './pages/Statistics';
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
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<EmployeeList />} />
              <Route path="employees">
                <Route index element={<EmployeeList />} />
                <Route path="new" element={<EmployeeForm />} />
                <Route path=":id" element={<EmployeeView />} />
                <Route path=":id/edit" element={<EmployeeForm />} />
              </Route>
              <Route path="departments">
                <Route index element={<DepartmentList />} />
                <Route path="new" element={<DepartmentForm />} />
                <Route path=":id" element={<DepartmentView />} />
                <Route path=":id/edit" element={<DepartmentForm />} />
              </Route>
              <Route path="statistics" element={<Statistics />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
