//region Imports
import {
    getMoviesQuery,
    getMovieByIdQuery,
    createMovieQuery,
    updateMovieQuery,
    deleteMovieQuery,
    getStatsQuery,
} from '../../queries/movie/movieQueries.js'

import {
    HTTP_STATUS_CODES,
    HTTP_STATUS_MESSAGES,
    RESPONSE_MESSAGES,
} from '../../utils/constants.js'

import { buildApiResponse } from '../../utils/commonFunctions.js'

// * Importing Validators (used INSIDE controller now)
import {
    validateAddMovieBody,
    validateUpdateMovieBody,
    movieIdValidator
} from '../../validators/movie/movieValidators.js'

import { validateMovieQueryFilters } from '../../validators/query/queryValidators.js'
//endregion Imports

//region Get Movies Controller
// * getMovies Controller Function
// * Fetches a list of movies based on sanitized search and filter criteria.
// * Validation is performed inside controller.
const getMovies = async (req, res, next) => {
    try {
        // * Validate query filters inside controller
        const validationResult = validateMovieQueryFilters?.(req ?? {})

        if (!validationResult?.isValid) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: RESPONSE_MESSAGES?.VALIDATION_FAILED,
                response: {
                    errors: validationResult?.errors ?? {},
                },
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        const cleanedQuery = validationResult?.cleanedQuery ?? {}

        let {
            search = '',
            language = '',
            genres = [],
            page = 1,
            limit = 10,
        } = cleanedQuery ?? {}

        // // * Reset page to 1 when search/filter is applied
        // if (
        //     search ||
        //     language ||
        //     (Array.isArray(genres) && (genres ?? [])?.length > 0)
        // ) {
        //     page = 1
        // }

        const result = await getMoviesQuery?.({
            search,
            language,
            genres,
            page,
            limit,
        })

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.MOVIES_FETCHED,
            response: {
                movies: result?.movies ?? [],
                pagination: result?.pagination ?? {},
            },
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Get Movies Controller

//region Get Movie By Id Controller
// * getMovieById Controller Function
// * Retrieves a single movie document using the ID provided in the URL parameters.
const getMovieById = async (req, res, next) => {
    try {
        const movieId = req?.params?.movieId ?? ''
        // * Validate Movie ID
        const { isValid = false, cleanedId = "" } = movieIdValidator?.({ movieId: movieId ?? '' });

        if (!isValid) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: 'Invalid ID parameter',
                response: {},
            })
            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        const movie = await getMovieByIdQuery?.({
            movieId: cleanedId ?? '',
        })

        if (!movie?.['Movie-Id']) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.NOT_FOUND,
                status: HTTP_STATUS_MESSAGES?.NOT_FOUND,
                message: 'Movie not found',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.NOT_FOUND)
                ?.send?.(response)
        }

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.MOVIE_FETCHED,
            response: {
                movie: movie ?? {},
            },
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Get Movie By Id Controller

//region Create Movie Controller
// * createMovie Controller Function
// * Handles the creation of a new movie entry in the database.
const createMovie = async (req, res, next) => {
    try {
        // * Validate request body inside controller
        const validationResult = validateAddMovieBody?.(req ?? {})

        if (!validationResult?.isValid) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: RESPONSE_MESSAGES?.VALIDATION_FAILED,
                response: {
                    errors: validationResult?.errors ?? {},
                },
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        const body = validationResult?.cleaned ?? {}

        const result = await createMovieQuery?.({
            title: body?.title ?? '',
            language: body?.language ?? '',
            genres: body?.genres ?? [],
            releaseYear: body?.releaseYear ?? null,
        })

        if (!result?.ok) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: result?.message ?? 'Movie creation failed',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.CREATED,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.MOVIE_CREATED,
            response: {
                movie: result?.movie ?? {},
            },
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.CREATED)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Create Movie Controller

//region Update Movie Controller
// * updateMovie Controller Function
// * Updates an existing movie's details based on provided partial data.
const updateMovie = async (req, res, next) => {
    try {
        // * Validate Movie ID
        const movieId = req?.params?.movieId ?? '';
        const { isValid = false, cleanedId = "" } = movieIdValidator?.({ movieId: movieId ?? '' });

        if (!isValid) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: 'Invalid ID parameter',
                response: {},
            })
            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }
        // * Validate request body inside controller
        const validationResult = validateUpdateMovieBody?.(req ?? {})

        if (!validationResult?.isValid) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: RESPONSE_MESSAGES?.VALIDATION_FAILED,
                response: {
                    errors: validationResult?.errors ?? {},
                },
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }


        const body = validationResult?.cleaned ?? {}

        const updated = await updateMovieQuery?.({
            movieId: cleanedId ?? '',
            title: body?.title,
            language: body?.language,
            genres: body?.genres,
            releaseYear: body?.releaseYear,
        })

        if (!updated?.['Movie-Id']) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.NOT_FOUND,
                status: HTTP_STATUS_MESSAGES?.NOT_FOUND,
                message: 'Movie not found',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.NOT_FOUND)
                ?.send?.(response)
        }

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.MOVIE_UPDATED,
            response: {
                movie: updated ?? {},
            },
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Update Movie Controller

//region Delete Movie Controller (Soft Delete)
// * deleteMovie Controller Function
// * Executes a soft delete on a movie entry to preserve data integrity for logs.
const deleteMovie = async (req, res, next) => {
    try {
        // * Validate Movie ID
        const movieId = req?.params?.movieId ?? '';
        const { isValid = false, cleanedId = "" } = movieIdValidator?.({ movieId: movieId ?? '' });

        if (!isValid) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: 'Invalid ID parameter',
                response: {},
            })
            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        const deleted = await deleteMovieQuery?.({
            movieId: cleanedId ?? '',
        })

        if (!deleted?.['Movie-Id']) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.NOT_FOUND,
                status: HTTP_STATUS_MESSAGES?.NOT_FOUND,
                message: 'Movie not found',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.NOT_FOUND)
                ?.send?.(response)
        }

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.MOVIE_DELETED,
            response: {},
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Delete Movie Controller (Soft Delete)

//region Get Stats Controller
// * getStats Controller Function
// * Aggregates high-level statistics for the admin dashboard.
const getStats = async (req, res, next) => {
    try {
        const stats = await getStatsQuery?.()

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: 'Stats fetched successfully',
            response: {
                stats: stats ?? {},
            },
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Get Stats Controller

//region Export
export {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getStats,
}
//endregion Export
