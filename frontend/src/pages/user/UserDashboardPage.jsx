//region Imports

// * React core hooks
import { useEffect, useMemo, useRef, useState } from 'react';

// * Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// * Navigation
import { useNavigate } from 'react-router-dom';

// * Movie slice
import {
	getMoviesThunk,
	selectMovies,
	selectMoviesLoading,
	selectMoviesError,
	selectMoviesPage,
	selectMoviesHasMore,
} from '../../redux/movie/movieSlice.js';

// * Auth
import { logoutThunk } from '../../redux/auth/authSlice.js';

// * Constants
import { DB_KEYS } from '../../utils/constants.js';

// * UI Components
import { Loader } from '../../components/common/Loader.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { UserMovieFilters } from '../../components/movies/UserMovieFilters.jsx';
import { MovieCards } from '../../components/movies/MovieCards.jsx';

//endregion Imports

//region User Dashboard Page
const UserDashboardPage = () => {
	try {
		const dispatch = useDispatch?.();
		const navigate = useNavigate?.();

		// * Redux state
		const movies = useSelector(selectMovies);
		const loading = useSelector(selectMoviesLoading);
		const error = useSelector(selectMoviesError);
		const page = useSelector(selectMoviesPage);
		const hasMore = useSelector(selectMoviesHasMore);

		// * Local filters
		const [filters, setFilters] = useState({
			search: '',
			language: '',
			genres: [],
		});

		const [isInitialFetch, setIsInitialFetch] = useState(true);

		// * Infinite scroll refs
		const observerRef = useRef(null);
		const loadMoreRef = useRef(null);

		// * Search flag
		const isSearching =
			Boolean(filters?.search) ||
			Boolean(filters?.language) ||
			(filters?.genres?.length ?? 0) > 0;

		//region Unauthorized Handler
		const handleUnauthorized = async () => {
			try {
				await dispatch?.(logoutThunk?.())?.unwrap?.();
			} catch (_) {
				// safe
			} finally {
				navigate?.('/auth', { replace: true });
			}
		};
		//endregion Unauthorized Handler

		// * Error Toast Message
		useEffect(() => {
			if (error) {
				toast.error(error ?? 'An Error Occurred');
			}
		}, [error]);

		//region Debounced Search / Filter Fetch
		useEffect(() => {
			const timer = setTimeout(async () => {
				try {
					await dispatch?.(
						getMoviesThunk?.({
							search: filters?.search ?? '',
							language: filters?.language ?? '',
							genres: filters?.genres ?? [],
							page: 1,
							limit: 12,
							append: false,
						}),
					)?.unwrap?.();

					setIsInitialFetch(false);
				} catch (err) {
					if (err?.unauthorized) {
						await handleUnauthorized?.();
					}
				}
			}, 500);

			return () => clearTimeout(timer);
		}, [filters]);
		//endregion Debounced Search / Filter Fetch

		//region Infinite Scroll Observer
		useEffect(() => {
			if (!loadMoreRef.current) return;

			observerRef.current = new IntersectionObserver(
				async (entries) => {
					const firstEntry = entries?.[0];

					if (firstEntry?.isIntersecting && hasMore && !loading && !isInitialFetch) {
						try {
							await dispatch?.(
								getMoviesThunk?.({
									search: filters?.search ?? '',
									language: filters?.language ?? '',
									genres: filters?.genres ?? [],
									page: page + 1,
									limit: 12,
									append: true,
								}),
							)?.unwrap?.();
						} catch (err) {
							if (err?.unauthorized) {
								await handleUnauthorized?.();
							}
						}
					}
				},
				{
					root: null,
					rootMargin: '200px',
					threshold: 0,
				},
			);

			observerRef.current.observe(loadMoreRef.current);

			return () => {
				if (observerRef.current && loadMoreRef.current) {
					observerRef.current.unobserve(loadMoreRef.current);
				}
			};
		}, [dispatch, filters, page, hasMore, loading, isInitialFetch]);
		//endregion Infinite Scroll Observer

		// * Derived UI states
		const hasMovies = (movies ?? [])?.length > 0;
		const showFilters = Boolean(hasMovies || isSearching);
		const showNoMoviesAlert = Boolean(!loading && !hasMovies && isSearching);

		//region Safe UI Mapping
		const safeMoviesForUI = useMemo(() => {
			return (movies ?? []).map((m) => ({
				id: m?.[DB_KEYS?.MOVIE_ID] ?? '',
				title: m?.[DB_KEYS?.TITLE] ?? '',
				language: m?.[DB_KEYS?.LANGUAGE] ?? '',
				genres: m?.[DB_KEYS?.GENRES] ?? [],
				releaseYear: m?.[DB_KEYS?.RELEASE_YEAR] ?? null,
			}));
		}, [movies]);
		//endregion Safe UI Mapping

		//region Reset Filters
		const handleReset = () => {
			setFilters({ search: '', language: '', genres: [] });
		};
		//endregion Reset Filters

		return (
			<div>
				<h3 className="fw-bold mb-3">User Dashboard</h3>

				{/* Initial Empty */}
				{!loading && !hasMovies && !isSearching && !isInitialFetch ? (
					<EmptyState
						title="Welcome 👋"
						message="No movies are available yet. Once movies are added, you can search and filter them here."
					/>
				) : null}

				{/* Filters */}
				{showFilters ? (
					<UserMovieFilters
						filters={filters ?? {}}
						setFilters={setFilters}
						onReset={handleReset}
					/>
				) : null}

				{/* Top Loader – Search / Filter */}
				{loading && page === 1 ? (
					<div className="text-center my-3">
						<Loader />
					</div>
				) : null}

				{/* No results */}
				{showNoMoviesAlert ? (
					<div className="alert alert-warning mt-3">No movies found</div>
				) : null}

				{/* Movies */}
				{hasMovies ? (
					<MovieCards movies={safeMoviesForUI ?? []} loading={loading ?? false} />
				) : null}

				{/* Bottom Loader */}
				{loading && hasMovies ? (
					<div className="text-center my-3">
						<Loader />
					</div>
				) : null}

				{/* Intersection Observer Sentinel */}
				{hasMovies && hasMore ? <div ref={loadMoreRef} style={{ height: '1px' }} /> : null}
			</div>
		);
	} catch (error) {
		return (
			<div className="container mt-5">
				<h4>User Dashboard Error</h4>
			</div>
		);
	}
};
//endregion User Dashboard Page

export default UserDashboardPage;
