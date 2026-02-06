// region Imports
// * NavLink for navigation
import { NavLink } from 'react-router-dom';

// * Route Paths from constants
import { ROUTE_PATHS } from '../../utils/constants.js';
// endregion

// region Admin Side Bar Component
const AdminSidebar = ({ collapsed, setCollapsed }) => {
	return (
		<aside
			className="bg-light border-end position-fixed start-0 d-flex flex-column align-items-center"
			style={{
				width: collapsed ? '60px' : '250px',
			}}
		>
			{/* Toggle Arrow */}
			<button
				type="button"
				className="btn btn-sm btn-primary position-absolute sidebar-minimize"
				onClick={() => setCollapsed((prev) => !prev)}
				title="Toggle arrow for Collapsing and Uncollapsing sidebar"
			>
				{collapsed ? '›' : '‹'}
			</button>

			{/* OPEN MODE */}
			{!collapsed ? (
				<div className="w-100 px-3 mt-3">
					<h6 className="fw-bold mb-3">Admin Menu</h6>

					<div className="d-flex flex-column gap-2">
						<NavLink
							to={ROUTE_PATHS.ADMIN_MOVIES}
							className={({ isActive }) =>
								`btn btn-sm text-start ${isActive ? 'btn-primary' : 'btn-outline-primary'}`
							}
							title="Movies Page navigator"
						>
							Movies
						</NavLink>

						<NavLink
							to={ROUTE_PATHS.ADMIN_LOGS}
							className={({ isActive }) =>
								`btn btn-sm text-start ${isActive ? 'btn-primary' : 'btn-outline-primary'}`
							}
							title="Logs page navigator"
						>
							Activity Logs
						</NavLink>
					</div>
				</div>
			) : null}

			{/* COLLAPSED MODE */}
			{collapsed ? (
				<div className="d-flex flex-column gap-3 mt-3">
					<NavLink
						to={ROUTE_PATHS?.ADMIN_MOVIES ?? '/admin/movies'}
						className={({ isActive }) =>
							`rounded-circle btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-primary'}`
						}
						style={{ width: '30px', height: '30px' }}
					>
						M
					</NavLink>

					<NavLink
						to={ROUTE_PATHS.ADMIN_LOGS ?? '/admin/logs'}
						className={({ isActive }) =>
							`rounded-circle btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-primary'}`
						}
						style={{ width: '30px', height: '30px' }}
					>
						A
					</NavLink>
				</div>
			) : null}
		</aside>
	);
};
// endregion

// region Export
export { AdminSidebar };
// endregion
