// region Imports

// * React Router component used to render nested child routes
import { Outlet } from 'react-router-dom';

// * Navigation bar component for user-facing pages
import { UserNavbar } from '../../../components/navbar/UserNavbar.jsx';

// endregion Imports

// region User Layout

// * Layout component responsible for wrapping all user routes
const UserLayout = () => {
  try {
    // * Render the user layout UI
    return (
      // * Root container occupying full width with no padding
      <div className="container-fluid p-0">
        {/* * User navigation bar displayed at the top */}
        <UserNavbar />

        {/* * Main content wrapper with spacing below navbar */}
        <main className="container mt-4 pt-5">
          {/* * Render nested user route components */}
          <Outlet />
        </main>
      </div>
    );
  } catch (error) {
    // * Fallback UI rendered if a runtime error occurs
    return (
      // * Container for displaying error state
      <div className="container mt-5">
        {/* * Generic error message shown to the user */}
        <h4>Something went wrong</h4>
      </div>
    );
  }
};

// endregion User Layout

// region Export

// * Export UserLayout for use in routing configuration
export { UserLayout };

// endregion Export
