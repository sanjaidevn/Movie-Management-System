//region Imports

// * React core hooks for managing component lifecycle and local state
import { useEffect, useState } from 'react';
// * Redux hooks for dispatching actions and accessing global state
import { useDispatch, useSelector } from 'react-redux';
// * Navigation hook for programmatic routing
import { useNavigate } from 'react-router-dom';

// * Activity log thunks and selectors for data fetching and state monitoring
import {
	getLogsThunk,
	selectLogs,
	selectLogsTotal,
	selectLogsLoading,
	selectLogsError,
} from '../../redux/activityLogs/activityLogsSlice.js';

// * Authentication thunk for handling user logout
import { logoutThunk } from '../../redux/auth/authSlice.js';

// * React Toast Messasge
import { toast } from 'react-toastify';
// * Table Component
import DataTable from '../../components/common/DataTable.jsx';
// * Reusable UI component for displaying loading spinners
import { Loader } from '../../components/common/Loader.jsx';

// * Log table inputs
import { logColumns } from '../../utils/TableInput.jsx';

//endregion Imports

//region Admin Logs Page
// * AdminLogsPage Component
// * Displays a paginated table of system activity logs fetched from the Redux store.
// * Includes functionality for changing page limits and navigating through pages.
const AdminLogsPage = () => {
	try {
		// Initialize Redux dispatch and select necessary state slices
		const dispatch = useDispatch?.();
		const navigate = useNavigate?.();

		const logs = useSelector(selectLogs);
		const total = useSelector(selectLogsTotal);
		const loading = useSelector(selectLogsLoading);
		const error = useSelector(selectLogsError);

		// Local state for pagination control
		const [page, setPage] = useState(1);
		const [limit, setLimit] = useState(10);

		// Calculate total pages based on the total count from the server and current limit
		const totalPages = Math?.ceil?.((total ?? 0) / (limit ?? 10)) ?? 1;

		//region Handle Unauthorized
		const handleUnauthorized = async () => {
			try {
				await dispatch?.(logoutThunk?.())?.unwrap?.();
			} catch (err) {
				// safe
			} finally {
				navigate?.('/admin/login');
			}
		};
		//endregion Handle Unauthorized

		// * Triggers the async Redux thunk to fetch logs from the backend.
		// * Uses unwrap() to allow local try/catch handling if needed.
		const fetchLogs = async (p = 1, l = 10) => {
			try {
				await dispatch?.(getLogsThunk?.({ page: p ?? 1, limit: l ?? 10 }))?.unwrap?.();
			} catch (err) {
				if (err?.unauthorized) {
					await handleUnauthorized?.();
				}
			}
		};

		// * Error Toast Message
		useEffect(() => {
			if (error) {
				toast.error(error ?? 'Failed to load logs');
			}
		}, [error]);

		// Re-fetch logs whenever the current page or items-per-page limit changes
		useEffect(() => {
			try {
				fetchLogs?.(page ?? 1, limit ?? 10);
			} catch {
				// safe
			}
		}, [page, limit]);

		// * Change handler for the pagination limit dropdown.
		// * Resets the page to 1 to avoid "out of bounds" pagination errors.
		const handleLimitChange = (e) => {
			try {
				const newLimit = Number(e?.target?.value ?? 10) || 10;
				setLimit(newLimit ?? 10);
				setPage(1);
			} catch (err) {
				// safe
			}
		};

		// Ensure logs is always an array before mapping to prevent runtime crashes
		const safeLogs = Array?.isArray?.(logs) ? logs : [];

		return (
			<div>
				<h3 className="fw-bold mb-3">Activity Logs</h3>
				{/* Main Content Area */}
				<div className="main-area">
					{' '}
					{/* Global Error Messaging */}
					{error && toast.error(error ?? 'Failed to load logs')}
					{/* Header Controls: Total count and Page Limit selector */}
					<div className="d-flex justify-content-between align-items-center mb-3">
						<div className="text-muted">
							Total Logs: <b>{total ?? 0}</b>
						</div>

						<div className="d-flex align-items-center gap-2">
							<label className="fw-semibold">Limit:</label>
							<select
								className="form-select form-select-sm"
								style={{ width: '90px' }}
								value={limit ?? 10}
								onChange={handleLimitChange}
							>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={20}>20</option>
							</select>
						</div>
					</div>
					{/* Absolute Loader Overlay */}
					{loading && (
						<div className="d-flex justify-content-center align-items-center bg-white bg-opacity-75 overlay-loader">
							<Loader />
						</div>
					)}
					{/* Logs Table */}
					<DataTable
						title="Activity Logs"
						columns={logColumns({ page, limit })}
						data={safeLogs}
						loading={loading}
						page={page}
						totalPages={totalPages}
						onPageChange={(p) => setPage(p)}
						emptyMessage="No logs found"
					/>
				</div>
			</div>
		);
	} catch (error) {
		// Component-level error boundary fallback
		return (
			<div className="container mt-5">
				<h4>Admin Logs Page Error</h4>
			</div>
		);
	}
};
//endregion Admin Logs Page

export default AdminLogsPage;
