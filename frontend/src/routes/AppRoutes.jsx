//region Imports

// * React core for component definition and lazy loading components
import { Suspense, lazy } from 'react';
// * Routing components for defining application navigation and redirects
import { Routes, Route, Navigate } from 'react-router-dom';

// * Component to restrict access to authenticated users
import { ProtectedRoute } from './protected/ProtectedRoute.jsx';
// * Component to restrict access to users with administrative privileges
import { AdminRoute } from './protected/AdminRoute.jsx';

// * Constant definitions for centralized route path management
import { ROUTE_PATHS } from '../utils/constants.js';

// * Layout wrapper for standard user-facing pages
import { UserLayout } from './layouts/user/UserLayout.jsx';
// * Layout wrapper for the administrative dashboard interface
import { AdminLayout } from './layouts/admin/AdminLayout.jsx';

// * Loading indicator to display while lazy-loaded components are fetching
import { Loader } from '../components/common/Loader.jsx';

//endregion Imports

//region Lazy Pages
// * Lazy auth page
const AuthPage = lazy(() => import('../pages/auth/AuthPage.jsx'));

const UserDashboardPage = lazy(() => import('../pages/user/UserDashboardPage.jsx'));

const AdminMoviesPage = lazy(() => import('../pages/admin/AdminMoviesPage.jsx'));
const AdminLogsPage = lazy(() => import('../pages/admin/AdminLogsPage.jsx'));

const NotFoundPage = lazy(() => import('../pages/common/NotFoundPage.jsx'));
//endregion Lazy Pages

//region App Routes
const AppRoutes = () => {
  try {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route
                path={ROUTE_PATHS?.USER_DASHBOARD ?? '/dashboard'}
                element={<UserDashboardPage />}
              />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route
                path={ROUTE_PATHS?.ADMIN_MOVIES ?? '/admin/movies'}
                element={<AdminMoviesPage />}
              />
              <Route path={ROUTE_PATHS?.ADMIN_LOGS ?? '/admin/logs'} element={<AdminLogsPage />} />
            </Route>
          </Route>

          {/* Not Found */}
          <Route path={ROUTE_PATHS?.NOT_FOUND ?? '*'} element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    );
  } catch (error) {
    return <div className="container mt-5">Routing Error</div>;
  }
};
//endregion App Routes

export { AppRoutes };
