import { Suspense, lazy, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../shared/ProtectedRoute';
import Profile from '../pages/profile/Profile';
const BranchListPage = lazy(() => import('../pages/BranchListPage'));
const ExpenseRevenueParent = lazy(() => import('../pages/ExpenseRevenueParent/ExpenseRevenueParent'));


const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const BranchManagement = lazy(() => import('../pages/BranchManagement'));

const AddExpense = lazy(() => import('../pages/ExpenseRevenueParent/AddExpense'));

// Helper to protect routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export const routes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      </RequireAuth>
    ),
  },
   {
  path: '/add-branches',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Suspense fallback={<div>Loading...</div>}>
          <BranchManagement />
        </Suspense>
      </ProtectedRoute>
    ),
  },
   {
    path: '/branch-list',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <Suspense fallback={<div>Loading...</div>}>
          <BranchListPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  
{
  path: '/manage-expense-revenue',
  element: (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <Suspense fallback={<div>Loading...</div>}>
        <ExpenseRevenueParent />
      </Suspense>
    </ProtectedRoute>
  ),
},
  {
    path: '/add-expense',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <Suspense fallback={<div>Loading...</div>}>
          <AddExpense />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
  path: '/profile',
  element: (
    <RequireAuth>
      <Suspense fallback={<div>Loading...</div>}>
        <Profile />
      </Suspense>
    </RequireAuth>
  ),
},
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
];