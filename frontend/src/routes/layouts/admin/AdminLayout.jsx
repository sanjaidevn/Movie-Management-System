// region Imports

// * React core hook for managing component state
import { useState } from 'react';

// * React Router component for rendering nested routes
import { Outlet } from 'react-router-dom';

// * Modal component used for creating a new admin user
import { CreateAdminModal } from '../../../components/admin/CreateAdminModal.jsx';

// * Navbar component for admin layout
import { AdminNavbar } from '../../../components/navbar/AdminNavbar.jsx';

// * Sidebar component for admin navigation
import { AdminSidebar } from '../../../components/sidebar/AdminSidebar.jsx';

// * Layout constants for navbar and sidebar dimensions
import { NAVBAR_HEIGHT, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '../../../utils/constants.js';

// endregion Imports

// region Admin Layout Component

// * Main layout component wrapping admin routes and UI structure
const AdminLayout = () => {
	// * State to control visibility of Create Admin modal
	const [showAdminModal, setShowAdminModal] = useState(false);

	// * Single source of truth for sidebar collapsed state
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	try {
		// * Render admin layout UI
		return (
			// * Root container
			<div className="container-fluid p-0">
				{/* * Admin navigation bar with create admin trigger */}
				<AdminNavbar onCreateAdmin={() => setShowAdminModal(true)} />

				<div>
					{/* * Admin sidebar with collapse state synced to layout */}
					<AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

					{/* * Modal for creating a new admin user */}
					<CreateAdminModal
						show={showAdminModal}
						onClose={() => setShowAdminModal(false)}
					/>

					{/*MAIN synced with sidebar */}
					<main
						className="main-admin-layout"
						style={{
							// * Adjust left margin based on sidebar collapse state
							marginLeft: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
						}}
					>
						{/* * Render nested admin routes */}
						<Outlet />
					</main>
				</div>
			</div>
		);
	} catch (error) {
		// * Fallback UI rendered when layout throws a runtime error
		return (
			// * Error container with top margin
			<div className="container mt-5">
				{/* * Generic error message */}
				<h4>Something went wrong</h4>
			</div>
		);
	}
};

// endregion Admin Layout Component

// region Export

// * Export AdminLayout for use in routing configuration
export { AdminLayout };

// endregion Export
