//region Imports
// * Importing regex rules and allowed values used for movie validation
import { REGEX, ALLOWED_LANGUAGES, ALLOWED_GENRES } from '../../utils/constants.js'

// * Importing Mongoose for Id validation
import mongoose from 'mongoose'

// * Importing shared sanitization and type-safety helpers
import {
    trimString,
    safeArray,
    toNumberOrUndefined,
    isFalsyValue,
} from '../../utils/commonFunctions.js'
//endregion Imports

//region Add Movie Body Validator
// * validateAddMovieBody Function
// * Validates request body for creating a new movie
// * Ensures title, language, genres, and releaseYear follow business rules
// * Used inside controller (not middleware)
const validateAddMovieBody = (req = {}) => {
    try {
        // * Safely extract request body
        const body = req?.body ?? {}

        // * Sanitize and normalize incoming fields
        const title = trimString(body?.title ?? '')
        const language = trimString(body?.language ?? '')
        const genres = safeArray(body?.genres ?? [])
        const releaseYear = toNumberOrUndefined(body?.releaseYear)

        // * Object to collect validation errors
        const errors = {}

        // * Title validation
        // * Required, regex-validated, and length-constrained
        if (isFalsyValue?.({ value: title })) {
            errors.title = 'title is required'
        } else if (!(REGEX?.MOVIE_TITLE?.test?.(title ?? '') ?? false)) {
            errors.title = 'Title format is invalid'
        } else if ((title ?? '')?.length > 40) {
            errors.title = 'Title must be at most 40 characters'
        }

        // * Language validation
        // * Must exist, be within allowed length, and be whitelisted
        if (!language) {
            errors.language = 'Language is required'
        } else if ((language ?? '')?.length > 30) {
            errors.language = 'Language must be at most 30 characters'
        } else if (!(ALLOWED_LANGUAGES?.includes?.(language.toUpperCase() ?? '') ?? false)) {
            errors.language = 'Language is not allowed'
        }

        // * Genres validation
        // * Must be a non-empty array with a max size of 10
        if (!Array.isArray(genres)) {
            errors.genres = 'Genres must be an array'
        } else if ((genres ?? [])?.length < 1) {
            errors.genres = 'At least one genre is required'
        } else if ((genres ?? [])?.length > 10) {
            errors.genres = 'You can add at most 10 genres'
        } else {
            // * Per-genre validation
            const genreErrors = []

                ; (genres ?? [])?.forEach?.((g, index, arr) => {
                    const genreValue = trimString(g ?? '')

                    if (!genreValue) {
                        genreErrors[index] = 'Genre is required'
                    } else if (
                        !(ALLOWED_GENRES?.includes?.(genreValue.toUpperCase() ?? '') ?? false)
                    ) {
                        genreErrors[index] = 'This Genre is not allowed'
                    } else if ((genreValue ?? '')?.length > 30) {
                        genreErrors[index] = 'Genre must be at most 30 characters'
                    } else if (
                        !(REGEX?.GENRE?.test?.(genreValue ?? '') ?? false)
                    ) {
                        genreErrors[index] = 'Genre format is invalid'
                    }
                })

            // * Attach genre errors only if any exist
            if ((genreErrors ?? [])?.some?.((x) => Boolean(x))) {
                errors.genres = genreErrors ?? []
            }
        }

        // * Release Year validation
        // * Optional, but must fall within a realistic year range
        if (releaseYear !== undefined) {
            const currentYear = new Date()?.getFullYear?.() ?? 2026
            if (releaseYear < 1900 || releaseYear > currentYear) {
                errors.releaseYear = 'Release year is invalid'
            }
        }

        // * Final validation status
        const isValid = Object?.keys?.(errors ?? {})?.length === 0

        // * Return validation result with sanitized data
        return {
            isValid: isValid ?? false,
            errors: errors ?? {},
            cleaned: {
                title: title ?? '',
                language: language ?? '',
                genres: genres ?? [],
                releaseYear: releaseYear ?? null,
            },
        }
    } catch (error) {
        // * Fallback for unexpected validation failures
        return {
            isValid: false,
            errors: { general: 'Validation failed' },
            cleaned: {},
        }
    }
}
//endregion Add Movie Body Validator

//region Update Movie Body Validator
// * validateUpdateMovieBody Function
// * Validates partial update payload for movies
// * Only fields present in the request are validated
const validateUpdateMovieBody = (req = {}) => {
    try {
        // * Safely extract request body
        const body = req?.body ?? {}

        // * Use undefined to detect which fields are included in the update
        const title =
            body?.title !== undefined
                ? trimString(body?.title ?? '')
                : undefined

        const language =
            body?.language !== undefined
                ? trimString(body?.language ?? '')
                : undefined

        const genres =
            body?.genres !== undefined
                ? safeArray(body?.genres ?? [])
                : undefined

        const releaseYear =
            body?.releaseYear !== undefined
                ? toNumberOrUndefined(body?.releaseYear)
                : undefined

        // * Object to collect validation errors
        const errors = {}

        // * Prevent empty update requests
        if (
            title === undefined &&
            language === undefined &&
            genres === undefined &&
            releaseYear === undefined
        ) {
            errors.general = 'At least one field is required'
        }

        // * Conditional title validation
        if (title !== undefined) {
            if (isFalsyValue?.({ value: title })) {
                errors.title = 'title is required'
            } else if (
                !(REGEX?.MOVIE_TITLE?.test?.(title ?? '') ?? false)
            ) {
                errors.title = 'Title format is invalid'
            } else if ((title ?? '')?.length > 100) {
                errors.title = 'Title must be at most 100 characters'
            }
        }

        // * Conditional language validation
        if (language !== undefined) {
            if (!language) {
                errors.language = 'Language is required'
            } else if ((language ?? '')?.length > 30) {
                errors.language = 'Language must be at most 30 characters'
            } else if (
                !(ALLOWED_LANGUAGES?.includes?.(language.toUpperCase() ?? '') ?? false)
            ) {
                errors.language = 'Language is not allowed'
            }
        }

        // * Conditional genres validation
        if (genres !== undefined) {
            if (!Array.isArray(genres)) {
                errors.genres = 'Genres must be an array'
            } else if ((genres ?? [])?.length < 1) {
                errors.genres = 'At least one genre is required'
            } else if ((genres ?? [])?.length > 10) {
                errors.genres = 'You can add at most 10 genres'
            } else {
                const genreErrors = []

                    ; (genres ?? [])?.forEach?.((g, index) => {
                        const genreValue = trimString(g ?? '')

                        if (!genreValue) {
                            genreErrors[index] = 'Genre is required'
                        } else if (
                            !(ALLOWED_GENRES?.includes?.(genreValue.toUpperCase() ?? '') ?? false)
                        ) {
                            genreErrors[index] = 'This Genre is not allowed'
                        } else if ((genreValue ?? '')?.length > 30) {
                            genreErrors[index] = 'Genre must be at most 30 characters'
                        } else if (
                            !(REGEX?.GENRE?.test?.(genreValue ?? '') ?? false)
                        ) {
                            genreErrors[index] = 'Genre format is invalid'
                        }
                    })

                // * Attach genre errors only if any exist
                if ((genreErrors ?? [])?.some?.((x) => Boolean(x))) {
                    errors.genres = genreErrors ?? []
                }
            }
        }

        // * Conditional release year validation
        if (releaseYear !== undefined) {
            const currentYear = new Date()?.getFullYear?.() ?? 2026
            if (releaseYear < 1900 || releaseYear > currentYear) {
                errors.releaseYear = 'Release year is invalid'
            }
        }

        // * Final validation status
        const isValid = Object?.keys?.(errors ?? {})?.length === 0

        // * Return validation result with only updated fields
        return {
            isValid: isValid ?? false,
            errors: errors ?? {},
            cleaned: {
                ...(title !== undefined ? { title: title ?? '' } : {}),
                ...(language !== undefined ? { language: language ?? '' } : {}),
                ...(genres !== undefined ? { genres: genres ?? [] } : {}),
                ...(releaseYear !== undefined
                    ? { releaseYear: releaseYear ?? null }
                    : {}),
            },
        }
    } catch (error) {
        // * Fallback for unexpected validation failures
        return {
            isValid: false,
            errors: { general: 'Validation failed' },
            cleaned: {},
        }
    }
}
//endregion Update Movie Body Validator



//region Validate Custom ID Param Middleware
const movieIdValidator = ({ movieId = '' } = {}) => {
    try {
        if (!movieId ||
            typeof movieId !== 'string' ||
            movieId.length !== 24 ||
            !(mongoose?.Types?.ObjectId?.isValid?.(movieId))) {
            return { isValid: false }
        }

        return {
            isValid: true,
            cleanedId: new mongoose.Types.ObjectId(movieId)
        }
    } catch (error) {
        // * Fallback for unexpected validation failures
        return { isValid: false }
    }
}
//endregion Validate Custom ID Param Middleware

//region Export
// * Exporting movie validators for controller-level validation
export { validateAddMovieBody, validateUpdateMovieBody, movieIdValidator }
//endregion Export
