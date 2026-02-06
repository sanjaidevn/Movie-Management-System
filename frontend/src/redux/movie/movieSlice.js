// region Imports

// * Redux Toolkit helpers for creating async thunks and slices
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// * API helpers for movie-related backend operations
import {
    getMoviesApi,
    createMovieApi,
    updateMovieApi,
    deleteMovieApi,
} from '../../api/movie/movieApi.js'

// * Utility helper to safely normalize values into arrays
import { safeArray } from '../../utils/commonFunctions.js'

// endregion Imports

// region Initial State

// * Initial Redux state for movie management
const initialState = {
    // * Stores list of movies fetched from API
    movies: [],

    // * Indicates loading state for async operations
    loading: false,

    // * Holds error messages from failed operations
    error: '',

    // * Current page number for pagination
    page: 1,

    // * Number of movies per page
    limit: 12,

    // * Indicates if more movies are available for pagination
    hasMore: true,

    // * Total number of pages available
    totalPages: 1,
}

// endregion Initial State

// region Get Movies Thunk

// * Async thunk to fetch movies with optional filters and pagination
const getMoviesThunk = createAsyncThunk(
    // * Unique action type for fetching movies
    'movies/getMovies',

    // * Async handler for movie fetching logic
    async (
        {
            search = '',
            language = '',
            genres = [],
            page = 1,
            limit = 12,
            append = false,
        } = {},
        thunkAPI,
    ) => {
        try {
            // * Call movies API with safe default values
            const res = await getMoviesApi?.({
                search: search ?? '',
                language: language ?? '',
                genres: genres ?? [],
                page: page ?? 1,
                limit: limit ?? 12,
            })


            // * Handle unauthorized API response
            if (res?.unauthorized) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: true,
                    message: 'Unauthorized',
                })
            }


            // * Extract API response payload safely
            const data = res?.data ?? {}

            // * Extract nested response object
            const response = data?.response ?? {}

            // * Normalize movies array from response
            const movies = safeArray(response?.movies ?? response?.Movies ?? [])

            // * Return structured payload for fulfilled reducer
            return {
                movies: movies ?? [],
                pagination: response?.pagination ?? {},
                append,
            }
        } catch (error) {
            // * Reject thunk on runtime or API failure
            return thunkAPI?.rejectWithValue?.({
                unauthorized: false,
                message: 'Failed to fetch movies',
            })
        }
    },
)

// endregion Get Movies Thunk

// region Create Movie Thunk

// * Async thunk to create a new movie
const createMovieThunk = createAsyncThunk(
    // * Unique action type for creating movie
    'movies/createMovie',

    // * Async handler for movie creation
    async (payload = {}, thunkAPI) => {
        try {
            // * Call create movie API with safe payload
            const res = await createMovieApi?.(payload ?? {})

            // * Extract API response data safely
            const data = res?.data ?? {}


            // * Handle unauthorized API response
            if (res?.unauthorized) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: true,
                    message: 'Unauthorized',
                })
            }

            // * Handle unsuccessful API response
            if (!res?.ok) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: false,
                    message: data?.message ?? 'Failed to create movie',
                })
            }

            // * Return successful response payload
            return data?.response ?? {}
        } catch (error) {
            // * Reject thunk on runtime or API error
            return thunkAPI?.rejectWithValue?.({
                unauthorized: false,
                message: 'Failed to create movie',
            })
        }
    },
)

// endregion Create Movie Thunk

// region Update Movie Thunk

// * Async thunk to update an existing movie
const updateMovieThunk = createAsyncThunk(
    // * Unique action type for updating movie
    'movies/updateMovie',

    // * Async handler for movie update logic
    async (payload = {}, thunkAPI) => {
        try {
            // * Call update movie API with payload
            const res = await updateMovieApi?.(payload ?? {})

            // * Extract API response data safely
            const data = res?.data ?? {}


            // * Handle unauthorized API response
            if (res?.unauthorized) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: true,
                    message: 'Unauthorized',
                })
            }


            // * Handle unsuccessful API response
            if (!res?.ok) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: false,
                    message: data?.message ?? 'Failed to update movie',
                })
            }

            // * Return successful update response
            return data?.response ?? {}
        } catch (error) {
            // * Reject thunk on runtime or API error
            return thunkAPI?.rejectWithValue?.({
                unauthorized: false,
                message: 'Failed to update movie',
            })
        }
    },
)

// endregion Update Movie Thunk

// region Delete Movie Thunk

// * Async thunk to delete a movie by ID
const deleteMovieThunk = createAsyncThunk(
    // * Unique action type for deleting movie
    'movies/deleteMovie',

    // * Async handler for movie deletion logic
    async ({ movieId = '' } = {}, thunkAPI) => {
        try {
            // * Call delete movie API with movie ID
            const res = await deleteMovieApi?.({
                movieId: movieId ?? '',
            })

            // * Extract API response data safely
            const data = res?.data ?? {}


            // * Handle unauthorized API response
            if (res?.unauthorized) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: true,
                    message: 'Unauthorized',
                })
            }


            // * Handle unsuccessful API response
            if (!res?.ok) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: false,
                    message: data?.message ?? 'Failed to delete movie',
                })
            }

            // * Return successful delete response
            return data?.response ?? {}
        } catch (error) {
            // * Reject thunk on runtime or API error
            return thunkAPI?.rejectWithValue?.({
                unauthorized: false,
                message: 'Failed to delete movie',
            })
        }
    },
)

// endregion Delete Movie Thunk

// region Slice

// * Redux slice for movie state management
const movieSlice = createSlice({
    // * Slice name used in Redux store
    name: 'movies',

    // * Assign initial state with safety fallback
    initialState: initialState ?? {},

    // * Synchronous reducers
    reducers: {
        // * Reset search applied flag
        resetLastSearchApplied: (state) => {
            state.lastSearchApplied = false
        },

        // * Clear existing movie error message
        clearMoviesError: (state) => {
            state.error = ''
        },
    },

    // * Handle async thunk lifecycle actions
    extraReducers: (builder) => {
        builder

            // region Get Movies

            // * Handle get movies pending state
            .addCase(getMoviesThunk.pending, (state) => {
                state.loading = true
                state.error = ''
            })

            // * Handle get movies fulfilled state
            .addCase(getMoviesThunk.fulfilled, (state, action) => {
                // * Extract payload values with defaults
                const {
                    movies = [],
                    pagination = {},
                    append = false,
                } = action.payload

                // * Append or replace movie list based on flag
                if (append) {
                    state.movies = [...state.movies, ...(movies ?? [])]
                } else {
                    state.movies = movies ?? []
                }

                // * Update pagination state values
                state.page = pagination?.page ?? 1
                state.limit = pagination?.limit ?? 12
                state.hasMore = pagination?.hasMore ?? false
                state.totalPages = pagination?.totalPages ?? 1

                // * Disable loading state
                state.loading = false

            })

            // * Handle get movies rejected state
            .addCase(getMoviesThunk.rejected, (state, action) => {
                state.loading = false
                state.movies = []
                state.error =
                    action?.payload?.message ?? 'Failed to fetch movies'
            })

            // endregion Get Movies

            // region Create Movie

            // * Handle create movie pending state
            .addCase(createMovieThunk.pending, (state) => {
                state.loading = true
                state.error = ''
            })

            // * Handle create movie fulfilled state
            .addCase(createMovieThunk.fulfilled, (state) => {
                state.loading = false
            })

            // * Handle create movie rejected state
            .addCase(createMovieThunk.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action?.payload?.message ?? 'Failed to create movie'
            })

            // endregion Create Movie

            // region Update Movie

            // * Handle update movie pending state
            .addCase(updateMovieThunk.pending, (state) => {
                state.loading = true
                state.error = ''
            })

            // * Handle update movie fulfilled state
            .addCase(updateMovieThunk.fulfilled, (state) => {
                state.loading = false
            })

            // * Handle update movie rejected state
            .addCase(updateMovieThunk.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action?.payload?.message ?? 'Failed to update movie'
            })

            // endregion Update Movie

            // region Delete Movie

            // * Handle delete movie pending state
            .addCase(deleteMovieThunk.pending, (state) => {
                state.loading = true
                state.error = ''
            })

            // * Handle delete movie fulfilled state
            .addCase(deleteMovieThunk.fulfilled, (state) => {
                state.loading = false
            })

            // * Handle delete movie rejected state
            .addCase(deleteMovieThunk.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action?.payload?.message ?? 'Failed to delete movie'
            })

        // endregion Delete Movie
    },
})

// endregion Slice

// region Selectors

// * Selector to retrieve movies array from state
const selectMovies = (state) => state?.movies?.movies ?? []

// * Selector to retrieve loading state
const selectMoviesLoading = (state) => state?.movies?.loading ?? false

// * Selector to retrieve error message
const selectMoviesError = (state) => state?.movies?.error ?? ''

// * Selector to retrieve current page number
const selectMoviesPage = (state) => state?.movies?.page ?? 1

// * Selector to retrieve hasMore pagination flag
const selectMoviesHasMore = (state) => state?.movies?.hasMore ?? false

// * Selector to retrieve total pages count
const selectMoviesTotalPages = (state) => state?.movies?.totalPages ?? 1

// endregion Selectors

// region Export

// * Extract synchronous action creators from slice
const { resetLastSearchApplied, clearMoviesError } = movieSlice.actions

// * Extract reducer from slice
const movieReducer = movieSlice.reducer

// * Export reducer, thunks, actions, and selectors
export {
    movieReducer,
    getMoviesThunk,
    createMovieThunk,
    updateMovieThunk,
    deleteMovieThunk,
    resetLastSearchApplied,
    clearMoviesError,
    selectMovies,
    selectMoviesLoading,
    selectMoviesError,
    selectMoviesPage,
    selectMoviesHasMore,
    selectMoviesTotalPages,
}

// endregion Export
