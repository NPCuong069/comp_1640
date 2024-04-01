import { lazy, Suspense, useState, useEffect } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import StudentIndex from '../pages/student/IndexPage';
import StudentArticleDetails from '../pages/student/ArticleDetailsPage';
import TermsAndConditionsPage from '../pages/student/TermsAndConditionsPage';
import AddNewPage from '../pages/student/AddNewPage';

import * as jwt_decode from 'jwt-decode';
const IndexPage = lazy(() => import('../pages/admin/app'));
const BlogPage = lazy(() => import('../pages/admin/blog'));
const UserPage = lazy(() => import('../pages/admin/user'));
const FacultyPage = lazy(() => import('../pages/admin/faculty'));
const ClosurePage = lazy(() => import('../pages/admin/closureDate'));
const ProductsPage = lazy(() => import('../pages/admin/products'));
const Page404 = lazy(() => import('../pages/admin/page-not-found'));

function decodeJWT(token) {
  if (!token) {
    console.error('Token is undefined or null.');
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token does not have the expected three parts.');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
function useAuthRole() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Check the token value

    if (token) {
      const decoded = decodeJWT(token);
      console.log('Decoded token:', decoded); // Check the decoded value

      if (decoded) {
        const roleUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        const role = decoded[roleUri];
        console.log('User role:', role); // Check the user role

        setUserRole(role);
      }
    }
  }, []);

  return userRole;
}
const token = localStorage.getItem('token');
if (token) {
  const decodedPayload = decodeJWT(token);
  const roleUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  const userRole = decodedPayload[roleUri];
  console.log(userRole);
}

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const decoded = token ? decodeJWT(token) : null;
  const userRole = decoded ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;

  return userRole === 'Admin' ? children : <Navigate to="/" replace />;
}
function ProtectedStudentRoute({ children }) {
  const token = localStorage.getItem('token');
  const decoded = token ? decodeJWT(token) : null;
  const userRole = decoded ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;

  return userRole === 'Student' ? children : <Navigate to="/" replace />;
}
function ProtectedMarketingCoordinatorRoute({ children }) {
  const token = localStorage.getItem('token');
  const decoded = token ? decodeJWT(token) : null;
  const userRole = decoded ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;

  return userRole === 'Marketing Coordinator' ? children : <Navigate to="/" replace />;
}
function UnifiedRouter() {
  const commonRoutes = [
    { path: '/', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/student/termsandconditions', element: <TermsAndConditionsPage />}
  ];
  const studentRoutes = [
    {
      element: (
        <ProtectedStudentRoute>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </ProtectedStudentRoute>
      ),
      children: [
        { path: '/student/index', element: <StudentIndex /> },
        { path: '/student/articleDetails/:title', element: <StudentArticleDetails /> },
        { path: '/student/addNew', element: <AddNewPage /> },
      ],
    },
  ];
  const marketingCoordinatorRoutes = [
    {
      element: (
        <ProtectedMarketingCoordinatorRoute>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </ProtectedMarketingCoordinatorRoute>
      ),
      children: [
        { path: '/student/index', element: <StudentIndex /> },
        { path: '/student/articleDetails/:title', element: <StudentArticleDetails /> },
        { path: '/student/addNew', element: <AddNewPage /> },
      ],
    },
  ];
  const adminRoutes = [
    {
      element: (
        <ProtectedAdminRoute>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedAdminRoute>
      ),
      children: [
        { path: 'admin', element: <Navigate to="/admin/index" replace /> },
        { path: 'admin/index', element: <IndexPage /> },
        { path: 'admin/user', element: <UserPage /> },
        { path: 'admin/faculty', element: <FacultyPage /> },
        { path: 'admin/closureDate', element: <ClosurePage /> },
        { path: 'admin/blog', element: <BlogPage /> },
        // Possibly more admin routes...
      ],
    },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ];

  const routesConfig = [...commonRoutes, ...studentRoutes, ...adminRoutes];

  return useRoutes(routesConfig);
}

export default UnifiedRouter;
