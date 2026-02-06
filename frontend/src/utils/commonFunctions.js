// region Imports

// * Import validation regular expressions used across helpers
import { VALIDATION_REGEX } from './constants.js'

// endregion Imports

// region Type Helpers

// * Check whether the provided value is a string
const isString = (val) =>
    // * Use typeof operator to validate string type
    typeof val === 'string'

// * Check whether the provided value is a finite number
const isNumber = (val) =>
    // * Ensure value is number type and finite using safe optional chaining
    typeof val === 'number' && Number?.isFinite?.(val)

// endregion Type Helpers



// region String Helpers

// * Safely trim a string value and return empty string on failure
const trimString = (val) => {
    try {
        // * Validate string type and safely trim value
        return isString(val) ? val?.trim?.() ?? '' : ''
    } catch (error) {
        // * Fallback return value if trimming throws error
        return ''
    }
}

// * Convert a value to lowercase after trimming safely
const toLowerTrim = (val) => {
    try {
        // * Normalize input and safely convert to lowercase
        return trimString(val ?? '')?.toLowerCase?.() ?? ''
    } catch (error) {
        // * Return empty string on unexpected runtime error
        return ''
    }
}

// endregion String Helpers

// region Safe Array Helper

// * Ensure a value is returned as a safe array
const safeArray = (val) => {
    try {
        // * Validate array type safely and return fallback empty array
        return Array?.isArray?.(val) ? val : []
    } catch (error) {
        // * Return empty array if validation fails
        return []
    }
}

// endregion Safe Array Helper

// region Safe Object Helper

// * Ensure a value is returned as a plain object
const safeObject = (val) => {
    try {
        // * Validate object type while excluding arrays
        if (val && typeof val === 'object' && !Array?.isArray?.(val)) return val
        // * Return empty object as fallback
        return {}
    } catch (error) {
        // * Return empty object on runtime error
        return {}
    }
}

// endregion Safe Object Helper

// region JSON Safe Parse

// * Safely parse JSON string with fallback support
const safeJsonParse = (raw, fallback = {}) => {
    try {
        // * Return fallback if raw input is missing
        if (!raw) return fallback ?? {}
        // * Attempt JSON parsing safely
        return JSON?.parse?.(raw ?? '') ?? fallback ?? {}
    } catch (error) {
        // * Return fallback object if parsing fails
        return fallback ?? {}
    }
}

// endregion JSON Safe Parse


// region Validate Name

// * Validate name field against rules and regex
const validateName = (value = '') => {
    try {
        // * Normalize name input by trimming safely
        const name = (value ?? '')?.trim?.() ?? ''

        // * Check for empty name
        if (!name) return 'Name is required'
        // * Enforce minimum character length
        if (name?.length < 3) return 'Name must be at least 3 characters'
        // * Enforce maximum character length
        if (name?.length > 20) return 'Name must be at most 20 characters'
        // * Validate name format using regex
        if (!VALIDATION_REGEX?.NAME?.test?.(name ?? '')) return 'Invalid Name'

        // * Return empty string when validation passes
        return ''
    } catch (error) {
        // * Return generic error message on exception
        return 'Invalid Name'
    }
}

// endregion Validate Name

// region Validate Email

// * Validate email field against formatting rules
const validateEmail = (value = '') => {
    try {
        // * Normalize email by trimming and lowercasing
        const email = (value ?? '')?.trim?.()?.toLowerCase?.() ?? ''

        // * Check for empty email input
        if (!email) return 'Email is required'
        // * Enforce maximum email length
        if (email?.length > 40) return 'Email must be at most 40 characters'
        // * Validate email format using regex
        if (!VALIDATION_REGEX?.EMAIL?.test?.(email ?? '')) return 'Invalid Email Address'

        // * Return empty string when validation passes
        return ''
    } catch (error) {
        // * Return error message on unexpected failure
        return 'Invalid Email Address'
    }
}

// endregion Validate Email

// region Validate Password

// * Validate password strength and format
const validatePassword = (value = '') => {
    try {
        // * Normalize password input safely
        const password = (value ?? '')?.trim?.() ?? ''

        // * Ensure password is provided
        if (!password) return 'Password is required'
        // * Validate password using regex rules
        if (!VALIDATION_REGEX?.PASSWORD?.test?.(password ?? '')) {
            return 'Password must be 8-20 chars, include uppercase, lowercase, number & special char'
        }

        // * Return empty string on valid password
        return ''
    } catch (error) {
        // * Return generic error on validation failure
        return 'Invalid password'
    }
}

// endregion Validate Password

// region Validate Confirm Password

// * Validate confirm password against original password
const validateConfirmPassword = (password = '', confirmPassword = '') => {
    try {
        // * Normalize original password
        const p = (password ?? '')?.trim?.() ?? ''
        // * Normalize confirm password
        const cp = (confirmPassword ?? '')?.trim?.() ?? ''

        // * Ensure confirm password is provided
        if (!cp) return 'Confirm password is required'
        // * Check password match
        if (p !== cp) return 'Passwords do not match'

        // * Return empty string when validation passes
        return ''
    } catch (error) {
        // * Return generic error on runtime exception
        return 'Invalid confirm password'
    }
}

// endregion Validate Confirm Password

// region Validate Movie Title

// * Validate movie title input
const validateMovieTitle = (value = '') => {
    try {
        // * Normalize movie title safely
        const title = (value ?? '')?.trim?.() ?? ''

        // * Ensure title is provided
        if (!title) return 'Title is required'
        // * Enforce maximum title length
        if (title?.length > 40) return 'Title must be at most 40 characters'
        // * Validate title format using regex
        if (!VALIDATION_REGEX?.MOVIE_TITLE?.test?.(title ?? '')) return 'Title format is invalid'

        // * Return empty string on success
        return ''
    } catch (error) {
        // * Return fallback error message
        return 'Invalid title'
    }
}

// endregion Validate Movie Title

// region Validate Language

// * Validate language input value
const validateLanguage = (value = '') => {
    try {
        // * Normalize language input safely
        const language = (value ?? '')?.trim?.() ?? ''

        // * Ensure language is provided
        if (!language) return 'Language is required'
        // * Enforce maximum length constraint
        if (language?.length > 30) return 'Language must be at most 30 characters'
        // * Validate language format using regex
        if (!VALIDATION_REGEX?.LANGUAGE?.test?.(language ?? '')) return 'Language format is invalid'

        // * Return empty string when validation passes
        return ''
    } catch (error) {
        // * Return error message on unexpected exception
        return 'Invalid language'
    }
}

// endregion Validate Language

// region Validate Genres

// * Validate genres array input
const validateGenres = (genres = []) => {
    try {
        // * Ensure genres is a valid array
        const g = Array?.isArray?.(genres) ? genres : []

        // * Ensure at least one genre exists
        if ((g ?? [])?.length === 0) return 'At least one genre is required'
        // * Enforce maximum genre count
        if ((g ?? [])?.length > 10) return 'You can add at most 10 genres'

        // * Detect invalid genre entries using regex
        const invalid = (g ?? [])?.find?.((x) => !VALIDATION_REGEX?.GENRE?.test?.((x ?? '')?.trim?.() ?? ''))
        // * Return error if any invalid genre is found
        if (invalid) return 'One or more genres are invalid'

        // * Return empty string on valid genres
        return ''
    } catch (error) {
        // * Return fallback error message
        return 'Invalid genres'
    }
}

// endregion Validate Genres

// region Validate Release Year

// * Validate movie release year value
const validateReleaseYear = (value = '') => {
    try {
        // * Allow empty value without validation
        if (value === null || value === undefined || value === '') return ''

        // * Convert input to number safely
        const year = Number(value ?? 0)

        // * Validate integer year value
        if (!Number?.isInteger?.(year ?? 0)) return 'Release year must be a valid number'

        // * Get current year with fallback
        const currentYear = new Date()?.getFullYear?.() ?? 2026

        // * Enforce minimum year constraint
        if (year < 1900) return 'Release year must be >= 1900'
        // * Enforce maximum year constraint
        if (year > currentYear) return `Release year must be <= ${currentYear}`

        // * Return empty string on success
        return ''
    } catch (error) {
        // * Return generic error message
        return 'Invalid release year'
    }
}

// endregion Validate Release Year

// region Pagination
// * Calculate Page Number UI
const getPaginationRange = (current, total) => {
    const pages = new Set();

    // First pages
    for (let i = 1; i <= Math.min(3, total); i++) {
        pages.add(i);
    }

    // Current page window
    for (let i = current - 1; i <= current + 1; i++) {
        if (i > 0 && i <= total) {
            pages.add(i);
        }
    }

    // Last pages
    for (let i = Math.max(total - 2, 1); i <= total; i++) {
        pages.add(i);
    }

    return [...pages].sort((a, b) => a - b);
};
// endregion

// region Capitilize First Letter
const CapitilizeFirstLetter = (word) => word?.charAt(0) + word?.slice(1)?.toLowerCase();

// region Export

// * Export all helper and validation utilities
export {
    isString,
    isNumber,
    trimString,
    toLowerTrim,
    safeArray,
    safeObject,
    safeJsonParse,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateMovieTitle,
    validateLanguage,
    validateGenres,
    validateReleaseYear,
    getPaginationRange,
    CapitilizeFirstLetter
}

// endregion Export
