import { lazy, Suspense, useState, useEffect } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import StudentIndex from '../pages/student/IndexPage';
import StudentArticleDetails from '../pages/student/ArticleDetailsPage';
import TermsAndConditionsPage from '../pages/student/TermsAndConditionsPage';
import HomePage from '../pages/student/HomePage';
import AddNewPage from '../pages/student/AddNewPage';
import CoordinatorIndex from '../pages/coordinator/IndexPage';
import CoordinatorArticleDetails from '../pages/coordinator/ArticleDetailsPage'
import ManagerIndex from '../pages/manager/IndexPage';
import ManagerArticleDetails from '../pages/manager/ArticleDetailsPage'
import ReadingPage from '../pages/student/ReadPage';
import OverviewPage from '../pages/student/Overview';
import MarketingCoordinatorOverview from '../pages/coordinator/Overview';
import ProfileSettings from '../pages/UserProfile';
import HomeFaculty from '../pages/student/HomeFaculty';
import GuestHome from '../pages/guest/HomeFaculty';
import GuestRead from '../pages/guest/ReadPage';
import MarketingManagerOverview from '../pages/manager/Overview';

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
function CustomLoginRoute() {
  const userRole = useAuthRole();

  if (userRole === 'Admin') {
    return <Navigate to="/admin/index" replace />;
  } else if (userRole === 'Student') {
    return <Navigate to="/student/index" replace />;
  } else if (userRole === 'Marketing Coordinator') {
    return <Navigate to="/coordinator/index" replace />;
  } else if (userRole === 'Marketing Manager') {
    return <Navigate to="/manager/index" replace />;
  } else if (userRole === 'Guest') {
    return <Navigate to="/guest/home" replace />;
  }
  // If no role or not logged in, show the login page
  return <LoginPage />;
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
function ProtectedGuestRoute({ children }) {
  const token = localStorage.getItem('token');
  const decoded = token ? decodeJWT(token) : null;
  const userRole = decoded ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;

  return userRole === 'Guest' ? children : <Navigate to="/" replace />;
}
function ProtectedMarketingManagerRoute({ children }) {
  const token = localStorage.getItem('token');
  const decoded = token ? decodeJWT(token) : null;
  const userRole = decoded ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;

  return userRole === 'Marketing Manager' ? children : <Navigate to="/" replace />;
}
function UnifiedRouter() {
  const commonRoutes = [
    { path: '/', element: <CustomLoginRoute /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/student/termsandconditions', element: <TermsAndConditionsPage /> }
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
        { path: '/student/readingPage/:title', element: <ReadingPage /> },
        { path: '/student/home', element: <HomePage /> },
        { path: '/student/overview', element: <OverviewPage /> },
        { path: '/student/profile', element: <ProfileSettings /> },
        { path: '/student/HomeFaculty/:faculty', element: <HomeFaculty /> },
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
        { path: '/coordinator/index', element: <CoordinatorIndex /> },
        { path: '/coordinator/articleDetails/:title', element: <CoordinatorArticleDetails /> },
        { path: '/coordinator/overview', element: <MarketingCoordinatorOverview /> },
        { path: '/coordinator/profile', element: <ProfileSettings /> },
      ],
    },
  ];
  const marketingManagerRoutes = [
    {
      element: (
        <ProtectedMarketingManagerRoute>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </ProtectedMarketingManagerRoute>
      ),
      children: [
        { path: '/manager/index', element: <ManagerIndex /> },
        { path: '/manager/articleDetails/:title', element: <ManagerArticleDetails /> },
        { path: '/manager/overview', element: <MarketingManagerOverview /> },
      ],
    },
  ];
  const guestRoutes = [
    {
      element: (
        <ProtectedGuestRoute>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </ProtectedGuestRoute>
      ),
      children: [
        { path: '/guest/home', element: <GuestHome /> },
        { path: '/guest/readingPage/:title', element: <GuestRead /> },
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
        { path: 'admin/dashboard', element: <DashboardLayout /> },
        // Possibly more admin routes...
      ],
    },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ];

  const routesConfig = [...commonRoutes, ...studentRoutes, ...adminRoutes, ...marketingCoordinatorRoutes, ...marketingManagerRoutes, ...guestRoutes];

  return useRoutes(routesConfig);
}

export default UnifiedRouter;
