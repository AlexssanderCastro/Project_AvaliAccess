
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import RegisterEstablishmentPage from '../pages/establishment/RegisterEstablishmentPage';
import EstablishmentDetailPage from '../pages/establishment/EstablishmentDetailPage';
import ExplorePage from '../pages/explore/ExplorePage';
import ProfilePage from '../pages/ProfilePage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminSponsoredPage from '../pages/admin/AdminSponsoredPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';

const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/explore',
        element: <ExplorePage />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/establishment/:id',
        element: <EstablishmentDetailPage />,
      },
      {
        path: '/establishment/:id/edit',
        element: (
          <ProtectedRoute>
            <RegisterEstablishmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/register-establishment',
        element: (
          <ProtectedRoute>
            <RegisterEstablishmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/reports',
        element: (
          <ProtectedRoute>
            <AdminReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/sponsored',
        element: (
          <ProtectedRoute>
            <AdminSponsoredPage />
          </ProtectedRoute>
        ),
      },
    ]
  }
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;


