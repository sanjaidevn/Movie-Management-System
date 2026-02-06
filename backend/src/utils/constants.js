//region FALSY VALUES

// * List of values treated as invalid / empty across the application
// * Used by validators to normalize empty or meaningless input
const FALSYVALUES = [
    "0",          // * String zero
    "false",      // * String false
    "undefined",  // * String undefined
    "null",       // * String null
    "NaN",        // * String NaN
    0,            // * Numeric zero
    false,        // * Boolean false
    undefined,    // * Undefined value
    null,         // * Null value
    NaN,          // * NaN numeric value
    ""            // * Empty string
];

//endregion

//region HTTP Status Codes
const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,

    TOO_MANY_REQUESTS: 429,
    UNSUPPORTED_MEDIA_TYPE: 415,
    INTERNAL_SERVER_ERROR: 500,
}
//endregion HTTP Status Codes

//region HTTP Status Messages
const HTTP_STATUS_MESSAGES = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    NOT_FOUND: 'Not found',
}
//endregion HTTP Status Messages

//region Response Messages (Central)
const RESPONSE_MESSAGES = {
    // General
    VALIDATION_FAILED: 'Validation failed',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN_ADMIN: 'Unauthorized: Admin access required',
    NOT_FOUND: 'Route not found',
    BAD_REQUEST: "Invalid Credentials",
    FORBIDDEN: 'Only Admin can create another Admin',
    UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
    INVALID_JSON: "Invalid Json",
    INVALID_CONTENT_TYPE: "Invalid Content Type",

    // Auth
    REGISTER_SUCCESS: 'Registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',

    // User
    PROFILE_FETCHED: 'User profile fetched successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_UPDATED: 'Password updated successfully',

    // Movies
    MOVIES_FETCHED: 'Movies fetched successfully',
    MOVIE_FETCHED: 'Movie fetched successfully',
    MOVIE_CREATED: 'Movie created successfully',
    MOVIE_UPDATED: 'Movie updated successfully',
    MOVIE_DELETED: 'Movie deleted successfully',
    MOVIES_NOT_FOUND: "Movies not found ",
    MOVIE_NOT_FOUND: "Movie not found ",

    MOVIE_ALREADY_EXISTS: 'Movie already exists with same title, language, and release year',


    //too many requests
    TOO_MANY_REQUESTS: "Too many attempts, please try again later",

    // Logs
    LOGS_FETCHED: 'Logs fetched successfully',

    // Errors
    INTERNAL_ERROR: 'Internal Server Error',

    // Health
    SERVER_HEALTHY: 'Server is healthy',
}
//endregion Response Messages (Central)

//region Regex Constants (Industry Level)
const REGEX = {
    // Name: starts with letter, allows space/dot/apostrophe/hyphen, total length 2-20
    NAME: /^[A-Za-z][A-Za-z .'-]{2,20}$/,

    // Email basic industry pattern (safe + common)
    EMAIL: /^[a-zA-Z0-9._ % +-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // Password: 8-32, 1 uppercase, 1 lowercase, 1 number, 1 special
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,

    // Movie title: allows punctuation
    MOVIE_TITLE: /^[A-Za-z0-9 .,'"!?:;()\-&+]+$/,

    // Genre: letters, numbers, space, &, apostrophe, hyphen
    GENRE: /^[A-Za-z0-9 &'-]+$/,
}
//endregion Regex Constants (Industry Level)

//region Allowed Languages
const ALLOWED_LANGUAGES = [
    'ENGLISH',
    'TAMIL',
    'TELUGU',
    'HINDI',
    'MALAYALAM',
    'KANNADA',
    'KOREAN',
    'JAPANESE',
    'SPANISH',
];
//endregion Allowed Languages

//region Allowed Languages
const ALLOWED_GENRES = [
    'ACTION',
    'DRAMA',
    'COMEDY',
    'ROMANCE',
    'THRILLER',
    'HORROR',
    'SCI-FI',
    'FANTASY',
    'CRIME',
    'ADVENTURE',
];
//endregion Allowed Languages

//region DB Field Keys (Hyphen Format)
const DB_KEYS = {
    // User
    USER_ID: 'User-Id',
    NAME: 'Name',
    EMAIL_ADDRESS: 'Email-Address',
    HASHED_PASSWORD: 'Hashed-Password',
    ROLE: 'Role',
    IS_DELETED: 'Is-Deleted',
    CREATED_AT: 'Created-At',
    UPDATED_AT: 'Updated-At',

    // Movie
    MOVIE_ID: 'Movie-Id',
    TITLE: 'Title',
    LANGUAGE: 'Language',
    GENRES: 'Genres',
    RELEASE_YEAR: 'Release-Year',

    // Logs
    LOG_ID: 'Log-Id',
    ACTIVITY_TYPE: 'Activity-Type',
    METHOD: 'Method',
    URL: 'Url',
    STATUS_CODE: 'Status-Code',
    IP: 'Ip',
    USER_AGENT: 'User-Agent',
    USER_EMAIL: 'User-Email',
    REQUEST_BODY: 'Request-Body',
    RESPONSE_BODY: 'Response-Body',
    DURATION_MS: 'Duration-Ms',
}
//endregion DB Field Keys (Hyphen Format)

//region Roles
const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
}
//endregion Roles


//region DATE & TIME CONSTANTS

// * Date and time configuration
// * Used for consistent timezone handling
const DATE_TIME_CONFIG = {
    TIMEZONE: "Asia/Kolkata",
    DATE_FORMAT: "YYYY-MM-DD HH:mm:ss a"
};
// endregion

//region Export
export {
    HTTP_STATUS_CODES,
    HTTP_STATUS_MESSAGES,
    RESPONSE_MESSAGES,
    REGEX,
    ALLOWED_LANGUAGES,
    DB_KEYS,
    ROLES,
    FALSYVALUES,
    ALLOWED_GENRES,
    DATE_TIME_CONFIG
}
//endregion Export
