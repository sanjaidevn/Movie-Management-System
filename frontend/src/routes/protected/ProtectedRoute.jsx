//region Imports

// * Navigation and outlet components for handling routing and nested views
import { Navigate, Outlet } from 'react-router-dom';
// * Redux hook for accessing global authentication and user state
import { useSelector } from 'react-redux';
// * Selector to determine if the user is currently logged in
import { selectIsAuthenticated } from '../../redux/auth/authSlice.js';

// * Constant definitions for application route paths
import { ROUTE_PATHS } from '../../utils/constants.js';

//endregion Imports

//region Protected Route
const ProtectedRoute = () => {
  try {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (!isAuthenticated) {
      return <Navigate to={ROUTE_PATHS?.AUTH ?? '/auth'} replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to={ROUTE_PATHS?.LOGIN ?? '/login'} replace />;
  }
};
//endregion Protected Route

export { ProtectedRoute };
