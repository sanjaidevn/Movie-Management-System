//region Imports
// * Importing environment configuration
import { env } from '../config/env/env.js'

// * Importing HTTP constants, falsy values list, and date-time configuration
import {
    HTTP_STATUS_CODES,
    HTTP_STATUS_MESSAGES,
    FALSYVALUES,
    DATE_TIME_CONFIG,
} from './constants.js'
//endregion Imports

// * Import moment-timezone for timezone-safe date handling
import moment from 'moment-timezone'

//region Type Helpers
// * Checks if a value is a string
const isString = (val) => typeof val === 'string'

// * Checks if a value is a finite number
const isNumber = (val) => typeof val === 'number' && Number.isFinite(val)
//endregion Type Helpers

//region String Helpers
// * Trims a string safely, returns empty string if input is not a string
const trimString = (val) => (isString(val) ? val.trim() : '')

// * Converts value to lowercase after trimming
const toLowerTrim = (val) => trimString(val ?? '')?.toLowerCase?.() ?? ''
//endregion String Helpers

//region Array Helpers
// * Ensures the value is always an array
const safeArray = (val) => (Array.isArray(val) ? val : [])
//endregion Array Helpers

//region Number Helpers
// * Converts input to a finite number or returns undefined
// * Used to safely parse numeric fields from request payloads
const toNumberOrUndefined = (val) => {
    try {
        if (val === undefined || val === null || val === '') return undefined
        const n = Number(val)
        if (!Number.isFinite(n)) return undefined
        return n
    } catch (error) {
        return undefined
    }
}
//endregion Number Helpers

//region API Response Builder
// * Builds a standardized API response object
// * Ensures consistent response structure across controllers
const buildApiResponse = ({
    statusCode = 200,
    status = '',
    message = '',
    response = {},
} = {}) => {
    try {
        return {
            statusCode: statusCode ?? 200,
            status: status ?? '',
            message: message ?? '',
            response: response ?? {},
        }
    } catch (error) {
        // * Fallback response in case of unexpected failure
        return {
            statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
            status: HTTP_STATUS_MESSAGES?.FAILED,
            message: 'Response build failed',
            response: {},
        }
    }
}
//endregion API Response Builder

//region Cookie Helpers
// * Sets authentication token as a secure HTTP-only cookie
const setAuthCookie = (res, token = '') => {
    try {
        const isProd = (env?.NODE_ENV ?? '') === 'production'

        return res?.cookie?.('token', token ?? '', {
            httpOnly: true,
            secure: isProd ?? false,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        })
    } catch (error) {
        return null
    }
}

// * Clears authentication cookie
const clearAuthCookie = (res) => {
    try {
        const isProd = (env?.NODE_ENV ?? '') === 'production'

        return res?.clearCookie?.('token', {
            httpOnly: true,
            secure: isProd ?? false,
            sameSite: isProd ? 'none' : 'lax',
        })
    } catch (error) {
        return null
    }
}
//endregion Cookie Helpers

//region Logger Utility
// * Centralized lightweight logging utility
// * Can be replaced later with Winston / Pino
const logger = {
    info: (...args) => {
        try {
            console?.log?.('[INFO]', ...(args ?? []))
        } catch (error) { }
    },

    warn: (...args) => {
        try {
            console?.warn?.('[WARN]', ...(args ?? []))
        } catch (error) { }
    },

    error: (...args) => {
        try {
            console?.error?.('[ERROR]', ...(args ?? []))
        } catch (error) { }
    },
}
//endregion Logger Utility

//region Genre Normalizer (ACTION, SCI-FI)
// * Normalizes genre values for consistent storage
// * Converts spaces to hyphens and uppercases text
const normalizeGenre = (genre = '') => {
    try {
        const g = trimString(genre ?? '')
        if (!g) return ''

        const formatted = g
            ?.replace?.(/\s+/g, '-')   // space → hyphen
            ?.replace?.(/-+/g, '-')    // collapse multiple hyphens
            ?.toUpperCase?.()

        return formatted ?? ''
    } catch (error) {
        return ''
    }
}
//endregion Genre Normalizer (ACTION, SCI-FI)

//region Title Normalizer
// * Normalizes movie titles (currently trims whitespace only)
const normalizeTitle = (title = '') => {
    try {
        return trimString(title ?? '')
    } catch (error) {
        return ''
    }
}
//endregion Title Normalizer

//region Safe Bracket Getter (for hyphen keys)
// * Safely retrieves object properties using bracket notation
// * Useful for keys like "Movie-Id"
const getKey = (obj, key = '') => {
    try {
        if (!obj) return undefined
        if (!key) return undefined
        return obj?.[key]
    } catch (error) {
        return undefined
    }
}
//endregion Safe Bracket Getter (for hyphen keys)

// * Checks whether a value belongs to predefined falsy values list
// * Used heavily in validation logic
const isFalsyValue = ({ value = null } = {}) => {
    try {
        // * Return true if value exists in falsy values list
        return FALSYVALUES?.includes?.(value) ?? true
    } catch (error) {
        // * Log unexpected validation failure
        logger.error([
            {
                message: 'Falsy value check failed',
                error,
                location: 'commonFunctions.isFalsyValue',
            },
        ])
        // * Fail-safe default
        return true
    }
}

//region DATE & TIME HELPERS
// * Converts a date into IST formatted string using moment-timezone
const formatToIST = ({
    date = new Date(),
} = {}) => {
    try {
        return moment(date)
            ?.tz?.(DATE_TIME_CONFIG?.TIMEZONE)
            ?.format?.(DATE_TIME_CONFIG?.DATE_FORMAT)
    } catch (error) {
        logger.error([
            {
                message: 'IST formatting failed',
                error,
                location: 'commonFunctions.formatToIST',
            },
        ])
        return null
    }
}
//endregion DATE & TIME HELPERS

//region Export
// * Exporting common reusable utility functions
export {
    isString,
    isNumber,
    trimString,
    toLowerTrim,
    safeArray,
    toNumberOrUndefined,
    buildApiResponse,
    setAuthCookie,
    clearAuthCookie,
    logger,
    normalizeGenre,
    normalizeTitle,
    getKey,
    isFalsyValue,
    formatToIST,
}
//endregion Export
