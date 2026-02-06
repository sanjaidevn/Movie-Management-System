// region Imports

// * React hook used for managing local component state
import { useState } from 'react';

// * React Router hook for navigation control
import { useNavigate } from 'react-router-dom';

// * Redux hooks for dispatching actions and selecting state
import { useDispatch, useSelector } from 'react-redux';

// * Authentication-related thunks and selectors from Redux slice
import { logoutThunk, selectAuthUser, selectAuthLoading } from '../../redux/auth/authSlice.js';

// * Reusable profile canvas component for user actions
import ProfileCanvas from '../common/ProfileCanvas.jsx';

// * Application constants for routing and database keys
import { ROUTE_PATHS, DB_KEYS } from '../../utils/constants.js';

// endregion Imports

// region User Navbar

// * Navigation bar component displayed for regular users
const UserNavbar = () => {
	// * Redux dispatch function for triggering actions
	const dispatch = useDispatch();

	// * Navigation helper for redirecting routes
	const navigate = useNavigate();

	// * Select authenticated user details from Redux store
	const user = useSelector(selectAuthUser);

	// * Select authentication loading state from Redux store
	const loading = useSelector(selectAuthLoading);

	// * Local state to control profile canvas visibility
	const [showCanvas, setShowCanvas] = useState(false);

	// * Resolve user display name with safe fallbacks
	const name = user?.[DB_KEYS?.NAME] ?? user?.name ?? 'User';

	// * Derive avatar letter from user name
	const letter = name?.charAt(0)?.toUpperCase();

	// * Handler function for performing logout action
	const handleLogout = async () => {
		try {
			// * Dispatch logout thunk and unwrap the result
			await dispatch(logoutThunk()).unwrap();

			// * Navigate to authentication route after logout
			navigate(ROUTE_PATHS.AUTH, { replace: true });
		} finally {
			// * Ensure profile canvas is closed after logout
			setShowCanvas(false);
		}
	};

	// * Render user navbar and profile canvas UI
	return (
		<>
			{/* * Fixed top navigation bar for user pages */}
			<nav
				className="navbar navbar-dark bg-dark px-3 fixed-top"
				style={{ background: `linear-gradient(135deg, #1e1e2f 0%, #4e54c8 100%)` }}
			>
				{/* * Application brand title */}
				<span className="navbar-brand fw-bold">Movie Manager</span>

				{/* * Right-aligned user avatar container */}
				<div className="ms-auto" title="Profile">
					{/* * Avatar button to open profile canvas */}
					<button
						className="rounded-circle bg-light text-dark fw-bold border-0"
						style={{ width: 36, height: 36 }}
						onClick={() => setShowCanvas(true)}
					>
						{letter}
					</button>
				</div>
			</nav>

			{/* * Profile canvas component for user options */}
			<ProfileCanvas
				show={showCanvas}
				onClose={() => setShowCanvas(false)}
				user={user}
				loading={loading}
				onLogout={handleLogout}
			/>
		</>
	);
};

// endregion User Navbar

// region Export

// * Export UserNavbar component for reuse
export { UserNavbar };

// endregion Export
