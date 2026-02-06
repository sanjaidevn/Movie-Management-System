//region Imports

// * Components for conditional navigation and nested route rendering
import { Navigate, Outlet } from 'react-router-dom';
// * Redux hook to extract data from the store state
import { useSelector } from 'react-redux';
// * Selectors to retrieve authentication status, user role, and profile data
import { selectIsAuthenticated, selectAuthRole } from '../../redux/auth/authSlice.js';

// * Application constants for user roles and routing paths
import { ROLES, ROUTE_PATHS } from '../../utils/constants.js';

//endregion Imports

//region Admin Route
const AdminRoute = () => {
  try {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectAuthRole);
    if (!isAuthenticated) {
      return <Navigate to={ROUTE_PATHS?.AUTH ?? '/auth'} replace />;
    }
    if ((role ?? '') !== (ROLES?.ADMIN ?? 'admin')) {
      return <Navigate to={ROUTE_PATHS?.USER_DASHBOARD ?? '/dashboard'} replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to={ROUTE_PATHS?.LOGIN ?? '/login'} replace />;
  }
};
//endregion Admin Route

export { AdminRoute };
