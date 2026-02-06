//region Imports

// * Hook for performing programmatic navigation between routes
import { useNavigate } from 'react-router-dom';

// * Constant definitions for application-wide routing paths
import { ROUTE_PATHS } from '../../utils/constants.js';

//endregion Imports

//region Not Found Page
const NotFoundPage = () => {
  try {
    const navigate = useNavigate?.();

    return (
      <div className="container mt-5 text-center">
        <h2 className="fw-bold">404 - Page Not Found</h2>
        <p className="text-muted">The page you are looking for does not exist.</p>

        <button
          className="btn btn-primary"
          onClick={() => navigate?.(ROUTE_PATHS?.USER_DASHBOARD ?? '/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mt-5 text-center">
        <h3>404 - Page Not Found</h3>
      </div>
    );
  }
};
//endregion Not Found Page

export default NotFoundPage;
