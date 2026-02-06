//region Imports
// * Importing Movie mongoose model
import { MovieModel } from '../../models/movie/movieModel.js'

// * Importing shared helpers for formatting, normalization, and sanitization
import {
    formatToIST,
    normalizeGenre,
    normalizeTitle,
    trimString,
} from '../../utils/commonFunctions.js'
//endregion Imports

//region Get Movies Query (filters + pagination)
// * getMoviesQuery
// * Fetches movies based on filters, search, and pagination
// * Supports language filter, genre filter, text search, and pagination
const getMoviesQuery = async ({
    search = '',
    language = '',
    genres = [],
    page = 1,
    limit = 10,
} = {}) => {
    try {
        // * Base query to exclude soft-deleted records
        const query = { 'Is-Deleted': 0 }

        // * Sanitize incoming search and language values
        const safeLanguage = trimString(language)
        const safeSearch = trimString(search)

        // * Language filter
        if (safeLanguage) {
            query.Language = safeLanguage
        }

        // * Normalize genres for consistent DB matching
        const normalizedGenres = Array.isArray(genres)
            ? genres.map((g) => normalizeGenre(g)).filter(Boolean)
            : []

        // * Genre filter (matches any of the provided genres)
        if (normalizedGenres.length > 0) {
            query.Genres = { $in: normalizedGenres }
        }

        // * Search Logic
        // * Escapes regex special characters to prevent regex injection
        if (safeSearch) {
            const escapedSearch = safeSearch.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
            )

            query.$or = [
                { Title: { $regex: escapedSearch, $options: 'i' } },
                { Language: { $regex: escapedSearch, $options: 'i' } },
                { Genres: { $in: [new RegExp(escapedSearch, 'i')] } },
            ]
        }

        // * Pagination offset calculation
        const skip = (page - 1) * limit

        // * Fetch paginated movie list and total count in parallel
        const [movies, totalCount] = await Promise.all([
            MovieModel.find(query)
                .sort({ 'Created-At': -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            MovieModel.countDocuments(query),
        ])

        // * Return movies along with pagination metadata
        return {
            movies: movies ?? [],
            pagination: {
                page,
                limit,
                totalRecords: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + movies.length < totalCount,
            },
        }
    } catch (error) {
        // * Safe fallback response on query failure
        return {
            movies: [],
            pagination: {
                page,
                limit,
                totalRecords: 0,
                totalPages: 0,
                hasMore: false,
            },
        }
    }
}
//endregion Get Movies Query (filters + pagination)

//region Get Movie By Movie-Id Query
// * getMovieByIdQuery
// * Fetches a single movie by its custom Movie-Id
// * Excludes soft-deleted records
const getMovieByIdQuery = async ({ movieId = '' } = {}) => {
    try {
        const movie = await MovieModel?.findOne?.({
            'Movie-Id': movieId ?? '',
            'Is-Deleted': 0,
        })?.lean?.()

        return movie ?? null
    } catch (error) {
        // * Return null if lookup fails
        return null
    }
}
//endregion Get Movie By Movie-Id Query

//region Create Movie Query
// * createMovieQuery
// * Creates a new movie record after normalizing fields
// * Handles duplicate movie prevention
const createMovieQuery = async ({
    title = '',
    language = '',
    genres = [],
    releaseYear = null,
} = {}) => {
    try {
        // * Normalize title and language
        const safeTitle = normalizeTitle(title ?? '')
        const safeLanguage = trimString(language ?? '')

        // * Normalize genres array
        const safeGenres = Array.isArray(genres) ? genres : []
        const normalizedGenres = (safeGenres ?? [])
            ?.map?.((g) => normalizeGenre(g ?? ''))
            ?.filter?.((g) => Boolean(g))

        // * Create movie document
        const created = await MovieModel?.create?.({
            Title: safeTitle ?? '',
            Language: safeLanguage ?? '',
            Genres: normalizedGenres ?? [],
            'Release-Year': releaseYear ?? null,
            'Is-Deleted': 0,
        })

        return {
            ok: true,
            movie: created ?? null,
            message: 'Movie created successfully',
        }
    } catch (error) {
        // * Duplicate prevention (unique index violation)
        if ((error?.code ?? 0) === 11000) {
            return {
                ok: false,
                movie: null,
                message:
                    'Movie already exists with same title, language, and release year',
            }
        }

        // * Generic failure fallback
        return {
            ok: false,
            movie: null,
            message: 'Movie creation failed',
        }
    }
}
//endregion Create Movie Query

//region Update Movie Query
// * updateMovieQuery
// * Updates an existing movie using partial update fields
// * Normalizes updated fields before persistence
const updateMovieQuery = async ({
    movieId = '',
    title,
    language,
    genres,
    releaseYear,
} = {}) => {
    try {
        const update = {}

        // * Conditional field updates
        if (title !== undefined)
            update.Title = normalizeTitle(title ?? '')
        if (language !== undefined)
            update.Language = trimString(language ?? '')

        // * Normalize genres if provided
        if (genres !== undefined) {
            const safeGenres = Array.isArray(genres) ? genres : []
            update.Genres = (safeGenres ?? [])
                ?.map?.((g) => normalizeGenre(g ?? ''))
                ?.filter?.((g) => Boolean(g))
        }

        // * Release year update
        if (releaseYear !== undefined)
            update['Release-Year'] = releaseYear ?? null

        // * Update timestamp
        update['Updated-At'] = formatToIST?.({}) ?? new Date()

        // * Execute atomic update
        const updated = await MovieModel?.findOneAndUpdate?.(
            { 'Movie-Id': movieId ?? '', 'Is-Deleted': 0 },
            { $set: update },
            { new: true }
        )?.lean?.()

        return updated ?? null
    } catch (error) {
        // * Return null on update failure
        return null
    }
}
//endregion Update Movie Query

//region Delete Movie Query (Soft Delete)
// * deleteMovieQuery
// * Performs a soft delete by setting Is-Deleted flag
const deleteMovieQuery = async ({ movieId = '' } = {}) => {
    try {
        const deleted = await MovieModel?.findOneAndUpdate?.(
            { 'Movie-Id': movieId ?? '', 'Is-Deleted': 0 },
            {
                $set: {
                    'Is-Deleted': 1,
                    'Updated-At': formatToIST?.({}) ?? new Date(),
                },
            },
            { new: true }
        )?.lean?.()

        return deleted ?? null
    } catch (error) {
        // * Return null on failure
        return null
    }
}
//endregion Delete Movie Query (Soft Delete)

//region Get Stats Query (Aggregation)
// * getStatsQuery
// * Aggregates movie statistics for admin dashboard
// * Groups movies by language and counts total records
const getStatsQuery = async () => {
    try {
        const pipeline = [
            { $match: { 'Is-Deleted': 0 } },
            {
                $group: {
                    _id: '$Language',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]

        const languageCounts = await MovieModel?.aggregate?.(
            pipeline ?? []
        )

        const totalMovies = await MovieModel?.countDocuments?.({
            'Is-Deleted': 0,
        })

        return {
            totalMovies: totalMovies ?? 0,
            languageCounts: languageCounts ?? [],
        }
    } catch (error) {
        // * Safe fallback on aggregation failure
        return {
            totalMovies: 0,
            languageCounts: [],
        }
    }
}
//endregion Get Stats Query (Aggregation)

//region Export
// * Exporting movie query functions
export {
    getMoviesQuery,
    getMovieByIdQuery,
    createMovieQuery,
    updateMovieQuery,
    deleteMovieQuery,
    getStatsQuery,
}
//endregion Export
