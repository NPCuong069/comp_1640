import { lazy, Suspense, useState,useEffect } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import LoginPage from '../pages/LoginPage'; 
import RegisterPage from '../pages/RegisterPage';
import StudentIndex  from '../pages/student/IndexPage';
import StudentArticleDetails from '../pages/student/ArticleDetailsPage';
import AddNewPage from '../pages/student/AddNewPage';

import * as jwt_decode from 'jwt-decode';
const IndexPage = lazy(() => import('../pages/admin/app'));
const BlogPage = lazy(() => import('../pages/admin/blog'));
const UserPage = lazy(() => import('../pages/admin/user'));
const FacultyPage = lazy(() => import('../pages/admin/faculty'));
const ProductsPage = lazy(() => import('../pages/admin/products'));
const Page404 = lazy(() => import('../pages/admin/page-not-found'));

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

const token = localStorage.getItem('token');
if (token) {
  const decodedPayload = decodeJWT(token);
  const roleUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  const userRole = decodedPayload[roleUri];
  console.log(userRole); 
}

function ProtectedAdminRoute({ children }) {
  const calculateIsAdmin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      const roleUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const userRole = decoded[roleUri];
      return userRole === 'Admin';
    }
    return false;
  };

  const isAdmin = calculateIsAdmin();

  return isAdmin ? children : <Navigate to="/" replace />;
}
function UnifiedRouter() {
  const commonRoutes = [
    { path: '/', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/student/index', element: <StudentIndex /> },
    { path: '/student/articleDetails', element: <StudentArticleDetails /> },
    { path: '/student/addNew', element: <AddNewPage /> },

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
        { path: 'admin/blog', element: <BlogPage /> },
        // Possibly more admin routes...
      ],
    },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ];

  const routesConfig = [...commonRoutes, ...adminRoutes];

  return useRoutes(routesConfig);
}

export default UnifiedRouter;
