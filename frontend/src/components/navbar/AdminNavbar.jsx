// region Imports

// * React hook for managing local component state
import { useState } from 'react';

// * React Router hook for programmatic navigation
import { useNavigate } from 'react-router-dom';

// * Redux hooks for dispatching actions and selecting state
import { useDispatch, useSelector } from 'react-redux';

// * Auth-related thunks and selectors from Redux slice
import { logoutThunk, selectAuthUser, selectAuthLoading } from '../../redux/auth/authSlice.js';

// * Reusable profile canvas component
import ProfileCanvas from '../common/ProfileCanvas.jsx';

// * Application-wide constants for DB keys, routes, and roles
import { DB_KEYS, ROUTE_PATHS, ROLES } from '../../utils/constants.js';

// endregion Imports

// region Admin Navbar

// * Admin navigation bar component displayed at the top of admin pages
const AdminNavbar = ({ onCreateAdmin }) => {
	try {
		// * Redux dispatch function for triggering actions
		const dispatch = useDispatch?.();

		// * Navigation helper for route redirection
		const navigate = useNavigate?.();

		// * Select authenticated user data from Redux store
		const user = useSelector(selectAuthUser);

		// * Select auth loading state from Redux store
		const loading = useSelector(selectAuthLoading);

		// * Resolve user role safely from multiple possible keys
		const role = (user?.[DB_KEYS?.ROLE] ?? user?.role ?? '')?.toLowerCase?.();

		// * Determine whether the current user is an admin
		const isAdmin = role === (ROLES?.ADMIN ?? 'admin');

		// * State to control visibility of profile canvas
		const [showCanvas, setShowCanvas] = useState(false);

		// * Resolve display name with safe fallbacks
		const name = user?.[DB_KEYS?.NAME] ?? user?.name ?? 'Admin';

		// * Derive avatar letter from user name
		const letter = name?.charAt(0)?.toUpperCase();

		// * Handler for performing logout action
		const handleLogout = async () => {
			try {
				// * Dispatch logout thunk and unwrap result
				await dispatch(logoutThunk?.()).unwrap();

				// * Navigate to auth route after logout
				navigate(ROUTE_PATHS?.AUTH ?? '/auth', { replace: true });
			} finally {
				// * Ensure profile canvas is closed after logout
				setShowCanvas(false);
			}
		};

		// * Render admin navbar and related UI
		return (
			<>
				{/* * Top fixed admin navigation bar */}
				<nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 fixed-top">
					{/* * Application brand title */}
					<span className="navbar-brand fw-bold ps-5">Movie Manager</span>

					{/* * Right-aligned action buttons */}
					<div className="ms-auto d-flex align-items-center gap-2">
						{/* * Conditionally render create admin button */}
						{isAdmin ? (
							<button
								className="btn btn-sm btn-light fw-semibold text-primary"
								onClick={() => onCreateAdmin?.()}
								title="Create Admin"
							>
								Create Admin
							</button>
						) : null}

						{/* * User avatar button */}
						<button
							className="rounded-circle bg-light text-primary fw-bold border-0"
							style={{ width: 36, height: 36 }}
							onClick={() => setShowCanvas(true)}
							title="Profile"
						>
							{letter}
						</button>
					</div>
				</nav>

				{/* * Profile canvas component for user actions */}
				<ProfileCanvas
					show={showCanvas}
					onClose={() => setShowCanvas(false)}
					user={user}
					loading={loading}
					onLogout={handleLogout}
					showCreateAdmin={isAdmin}
					onCreateAdmin={onCreateAdmin}
				/>
			</>
		);
	} catch (error) {
		// * Suppress rendering if unexpected runtime error occurs
		return null;
	}
};

// endregion Admin Navbar

// region Export

// * Export AdminNavbar component for reuse
export { AdminNavbar };

// endregion Export
