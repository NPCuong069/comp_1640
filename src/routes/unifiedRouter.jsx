import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
// Admin imports
import DashboardLayout from '../layouts/dashboard';

// User imports
import LoginPage from '../pages/LoginPage'; // Ensure paths are correct
import RegisterPage from '../pages/RegisterPage';
// Other imports...

// Lazy imports for admin pages
const IndexPage = lazy(() => import('../pages/admin/app'));
const BlogPage = lazy(() => import('../pages/admin/blog'));
const UserPage = lazy(() => import('../pages/admin/user'));
const ProductsPage = lazy(() => import('../pages/admin/products'));
const Page404 = lazy(() => import('../pages/admin/page-not-found'));

function UnifiedRouter() {
  const commonRoutes = [
    { path: '/', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    // Possibly more shared routes...
  ];

  const adminRoutes = [
    {
      element: <DashboardLayout><Suspense fallback={<div>Loading...</div>}><Outlet /></Suspense></DashboardLayout>,
      children: [
        { path: 'admin', element: <Navigate to="/admin/index" replace /> },
        { path: 'admin/index', element: <IndexPage /> },
        { path: 'admin/user', element: <UserPage /> },
        { path: 'admin/products', element: <ProductsPage /> },
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
