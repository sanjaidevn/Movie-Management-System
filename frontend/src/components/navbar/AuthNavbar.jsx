//region Imports

// * React Router hooks
import { useNavigate, useLocation } from 'react-router-dom';

// * Route constants
import { ROUTE_PATHS } from '../../utils/constants.js';

//endregion Imports

//region Auth Navbar
// * AuthNavbar
// * Used only for authentication-related pages
// * Provides SignIn / SignUp navigation
const AuthNavbar = () => {
	try {
		const navigate = useNavigate?.();
		const location = useLocation?.();

		// * Current path & query
		const pathname = location?.pathname ?? '';
		const search = location?.search ?? '';

		// * Active state helpers
		const isAuthRoute = pathname === (ROUTE_PATHS?.AUTH ?? '/auth');
		const isSignUpMode = search?.includes?.('mode=signup');

		return (
			<nav className="navbar navbar-dark bg-dark">
				<div className="container">
					{/* Brand */}
					<span
						className="navbar-brand fw-bold"
						role="button"
						tabIndex={0}
						onClick={() => navigate?.(ROUTE_PATHS?.AUTH ?? '/auth')}
					>
						🎬 Movie Manager
					</span>

					{/* Action buttons */}
					<div className="d-flex gap-2">
						{/* SignIn */}
						<button
							type="button"
							className={`btn btn-sm ${
								isAuthRoute && !isSignUpMode ? 'btn-light' : 'btn-outline-light'
							}`}
							onClick={() => navigate?.(ROUTE_PATHS?.AUTH ?? '/auth')}
						>
							SignIn
						</button>

						{/* SignUp */}
						<button
							type="button"
							className={`btn btn-sm ${
								isAuthRoute && isSignUpMode ? 'btn-light' : 'btn-outline-light'
							}`}
							onClick={() =>
								navigate?.(`${ROUTE_PATHS?.AUTH ?? '/auth'}?mode=signup`)
							}
						>
							SignUp
						</button>
					</div>
				</div>
			</nav>
		);
	} catch (error) {
		// * Fail silently to avoid blocking auth flow
		return null;
	}
};
//endregion Auth Navbar

//region Export
export { AuthNavbar };
//endregion Export
