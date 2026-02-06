//region Imports

// * React core hooks for managing state, effects, and memoized values
import { useEffect, useMemo, useState } from 'react';

// * Redux hooks for interacting with the global store
import { useDispatch, useSelector } from 'react-redux';
// * Navigation hook for handling client-side routing
import { useNavigate } from 'react-router-dom';

// * Movie-related thunks for CRUD operations and selectors for state access
import {
	getMoviesThunk,
	createMovieThunk,
	updateMovieThunk,
	deleteMovieThunk,
	selectMovies,
	selectMoviesLoading,
	selectMoviesError,
	selectMoviesPage,
	selectMoviesTotalPages,
} from '../../redux/movie/movieSlice.js';

// * Authentication thunk for terminating user sessions
import { logoutThunk } from '../../redux/auth/authSlice.js';

// * React Toast Messasge
import { toast } from 'react-toastify';
// * Visual component for displaying states with no data
import { EmptyState } from '../../components/common/EmptyState.jsx';
// * Filter interface for searching and narrowing movie list
import { UserMovieFilters } from '../../components/movies/UserMovieFilters.jsx';
// * Reusable spinner component for loading states
import { Loader } from '../../components/common/Loader.jsx';
// * Tabular display component for listing movie data
import DataTable from '../../components/common/DataTable.jsx';
// * Modal interface for adding or editing movie records
import { MovieFormModal } from '../../components/movies/MovieFormModal.jsx';
// * Confirmation modal for destructive actions
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

// * Utility Method for Capitilize first letter
import { CapitilizeFirstLetter } from '../../utils/commonFunctions.js';
// * Table Inputs
import { movieColumns } from '../../utils/TableInput.jsx';

// * Global configuration keys for database and API interactions
import { DB_KEYS } from '../../utils/constants.js';
//endregion Imports

//region Admin Movies Page
// * AdminMoviesPage Component
// * Provides a full CRUD interface for managing movies.
// * Handles fetching, creating, updating, and deleting movies via Redux thunks.

const AdminMoviesPage = () => {
	try {
		// Redux hooks for dispatching actions and accessing global movie state
		const dispatch = useDispatch?.();
		const navigate = useNavigate?.();

		const movies = useSelector(selectMovies);
		const loading = useSelector(selectMoviesLoading);
		const error = useSelector(selectMoviesError);
		const page = useSelector(selectMoviesPage);
		const totalPages = useSelector(selectMoviesTotalPages);

		const LIMIT = 10; // or 20 if you want

		// Local state for modal visibility and form mode (Add vs Edit)
		const [showModal, setShowModal] = useState(false);
		const [mode, setMode] = useState('add'); // add | edit
		const [selectedMovie, setSelectedMovie] = useState(null);
		//Admin Search & Filter State
		// * Local filter state for admin movie listing
		const [filters, setFilters] = useState({
			search: '',
			language: '',
			genres: [],
		});
		const [isInitialFetch, setIsInitialFetch] = useState(true);
		// State for transient success feedback messages
		const [successMsg, setSuccessMsg] = useState('');
		// * Helper constants for conditional rendering logic
		const hasMovies = (movies ?? [])?.length > 0;
		// * Determine if we are performing a search/filter or just a generic load
		const isSearching = filters?.search || filters?.language || filters?.genres?.length > 0;
		// * Determine if we can show filter based on no of movies
		const showFilters = Boolean(hasMovies || isSearching);
		// * Show specific feedback when a search returns zero results
		const showNoMoviesAlert = Boolean(!loading && !hasMovies && isSearching);

		// * Delete confirmation modal state
		const [showDeleteModal, setShowDeleteModal] = useState(false);
		const [movieToDelete, setMovieToDelete] = useState(null);

		//region Handle Unauthorized
		const handleUnauthorized = async () => {
			try {
				await dispatch?.(logoutThunk?.())?.unwrap?.();
			} catch (err) {
				// safe
			} finally {
				navigate?.('/auth', { replace: true });
			}
		};
		//endregion Handle Unauthorized

		// * Success Toast Message
		useEffect(() => {
			if (successMsg) {
				toast.info(successMsg);
			}
		}, [successMsg]);

		// * Error Toast Message
		useEffect(() => {
			if (error) {
				toast.error(error ?? 'An Error Occurred');
			}
		}, [error]);

		//region Admin Search & Filter Effect
		// * Debounced search & filter for admin movie list
		useEffect(() => {
			const timer = setTimeout(async () => {
				try {
					await dispatch?.(
						getMoviesThunk?.({
							search: filters?.search ?? '',
							language: filters?.language ?? '',
							genres: filters?.genres ?? [],
							page: 1,
							limit: LIMIT,
						}),
					)?.unwrap?.();
					setIsInitialFetch(false);
				} catch (err) {
					if (err?.unauthorized) {
						await handleUnauthorized?.();
					}
				}
			}, 500); // debounce for admin search

			return () => clearTimeout(timer);
		}, [filters]);
		//endregion Admin Search & Filter Effect

		// * useMemo hook to transform raw API movie data into a format
		// * compatible with the MovieTable component using standardized DB_KEYS.
		const safeMoviesForTable = useMemo(() => {
			try {
				return (movies ?? [])?.map?.((m) => {
					const language = m?.[DB_KEYS?.LANGUAGE] ?? '';
					const genres = m?.[DB_KEYS?.GENRES] ?? [];
					return {
						id: m?.[DB_KEYS?.MOVIE_ID] ?? '',
						title: m?.[DB_KEYS?.TITLE] ?? '',
						language: CapitilizeFirstLetter(language),
						genres: genres?.map((genre) => CapitilizeFirstLetter(genre)),
						releaseYear: m?.[DB_KEYS?.RELEASE_YEAR] ?? null,
					};
				});
			} catch (err) {
				return [];
			}
		}, [movies]);

		// Triggers the modal in 'add' mode for creating a new entry
		const openAddModal = () => {
			try {
				setMode('add');
				setSelectedMovie(null);
				setShowModal(true);
			} catch (err) {
				// safe
			}
		};

		// Triggers the modal in 'edit' mode with pre-populated data from the selected movie
		const openEditModal = (movie) => {
			try {
				setMode('edit');
				setSelectedMovie(movie ?? null);
				setShowModal(true);
			} catch (err) {
				// safe
			}
		};

		// * Hadnles Paginations
		const handlePageChange = async (newPage) => {
			try {
				if (newPage < 1 || newPage > totalPages) return;

				await dispatch?.(
					getMoviesThunk({
						search: filters?.search ?? '',
						language: filters?.language ?? '',
						genres: filters?.genres ?? [],
						page: newPage,
						limit: LIMIT,
					}),
				)?.unwrap?.();
			} catch (err) {
				if (err?.unauthorized) {
					await handleUnauthorized?.();
				}
			}
		};

		//region Reset Admin Filters
		const handleResetFilters = async () => {
			try {
				setFilters({ search: '', language: '', genres: [] });
			} catch (err) {
				if (err?.unauthorized) {
					await handleUnauthorized?.();
				}
			}
		};
		//endregion Reset Admin Filters

		// * Deletion handler with user confirmation.
		// * Re-fetches the movie list upon successful deletion to keep UI in sync.
		//region Delete Movie Flow

		// * Open delete confirmation modal
		const openDeleteModal = (movie) => {
			try {
				setMovieToDelete(movie ?? null);
				setShowDeleteModal(true);
			} catch (err) {
				// safe
			}
		};

		// * Confirm delete action
		const handleConfirmDelete = async () => {
			try {
				const movieId = movieToDelete?.id ?? '';
				if (!movieId) return;

				await dispatch?.(deleteMovieThunk?.({ movieId: movieId ?? '' }))?.unwrap?.();

				setSuccessMsg('Movie deleted successfully');

				// * Refresh movie list
				await dispatch?.(
					getMoviesThunk({
						search: filters?.search ?? '',
						language: filters?.language ?? '',
						genres: filters?.genres ?? [],
						page: page ?? 1,
						limit: LIMIT,
					}),
				)?.unwrap?.();
			} catch (err) {
				if (err?.unauthorized) {
					await handleUnauthorized?.();
				}
			} finally {
				setShowDeleteModal(false);
				setMovieToDelete(null);
			}
		};

		//endregion Delete Movie Flow

		// Resets modal state
		const handleModalClose = () => {
			try {
				setShowModal(false);
			} catch (err) {
				// safe
			}
		};

		// * Combined submit handler for both Add and Edit operations.
		// * Determines the appropriate thunk based on the 'mode' state.
		const handleSubmitMovie = async (payload) => {
			try {
				setSuccessMsg('');

				if ((mode ?? '') === 'add') {
					await dispatch?.(createMovieThunk?.(payload ?? {}))?.unwrap?.();
					setSuccessMsg('Movie created successfully');
				}

				if ((mode ?? '') === 'edit') {
					const movieId = selectedMovie?.id ?? '';
					await dispatch?.(
						updateMovieThunk?.({
							...(payload ?? {}),
							movieId: movieId ?? '',
						}),
					)?.unwrap?.();
					setSuccessMsg('Movie updated successfully');
				}

				// Close modal and refresh the data list after successful server update
				setShowModal(false);
				await dispatch?.(
					getMoviesThunk({
						page: 1,
						limit: LIMIT,
					}),
				)?.unwrap?.();
			} catch (err) {
				if (err?.unauthorized) {
					await handleUnauthorized?.();
				}
			}
		};

		// * User Dashboard Page
		// * Features persistent layout to prevent jumping during pagination
		return (
			<div>
				{/* Header Section */}
				<div
					className="d-flex justify-content-between align-items-center mb-3"
					title="Add Movie"
				>
					<h3 className="fw-bold ">Admin Movies</h3>
					<button className="btn btn-outline-primary" onClick={openAddModal}>
						+ Add Movie
					</button>
				</div>

				{/* Empty state displayed only on initial load */}
				{!loading && !hasMovies && !isSearching && !isInitialFetch ? (
					<EmptyState
						title="Welcome Admin 👑"
						message="Your movies list is empty. Please add new movies."
					/>
				) : null}

				{/* Admin Search & Filters */}
				{showFilters ? (
					<UserMovieFilters
						filters={filters ?? {}}
						setFilters={setFilters}
						onReset={handleResetFilters}
					/>
				) : null}

				{/* Main Content Area */}
				<div className="main-area">
					{/* Absolute Loader Overlay */}
					{loading && (
						<div className="d-flex justify-content-center align-items-center bg-white bg-opacity-75 overlay-loader">
							<Loader />
						</div>
					)}

					{/* Alert for empty search results */}
					{showNoMoviesAlert ? (
						<div className="alert alert-warning mt-3">No movies found</div>
					) : null}

					{/* Table Section: Persists during load with reduced opacity to prevent layout shift */}
					{(movies ?? []).length > 0 ? (
						<div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
							<DataTable
								title="Movies"
								columns={movieColumns({
									page,
									onEdit: openEditModal,
									onDelete: openDeleteModal,
								})}
								data={safeMoviesForTable}
								loading={loading}
								page={page}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								emptyMessage="No movies found"
							/>
						</div>
					) : null}
				</div>

				{/* Modals */}
				{showModal ? (
					<MovieFormModal
						show={showModal}
						mode={mode ?? 'add'}
						movie={selectedMovie ?? null}
						onClose={handleModalClose}
						onSubmit={handleSubmitMovie}
						error={error}
					/>
				) : null}

				<ConfirmModal
					show={showDeleteModal}
					title="Delete Movie"
					message={`Are you sure you want to delete "${movieToDelete?.title ?? 'this movie'}"?`}
					confirmText="Delete"
					cancelText="Cancel"
					loading={loading ?? false}
					onCancel={() => {
						setShowDeleteModal(false);
						setMovieToDelete(null);
					}}
					onConfirm={handleConfirmDelete}
				/>
			</div>
		);
	} catch (error) {
		// Global component error fallback
		return (
			<div className="container mt-5">
				<h4>Admin Movies Page Error</h4>
			</div>
		);
	}
};
//endregion Admin Movies Page

export default AdminMoviesPage;
