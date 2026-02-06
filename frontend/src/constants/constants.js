//region App Constants
const APP_CONSTANTS = {
    APP_NAME: 'Movie Management System',
}
//endregion App Constants

//region API Constants
const API_CONSTANTS = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
}
//endregion API Constants

//region Routes
const ROUTE_PATHS = {
    LOGIN: '/login',
    REGISTER: '/register',
    AUTH: "/auth",
    ADMIN_LOGIN: '/admin/login',
    ADMIN_REGISTER: '/admin/register',

    USER_DASHBOARD: '/dashboard',
    ADMIN_MOVIES: '/admin/movies',
    ADMIN_LOGS: '/admin/logs',

    NOT_FOUND: '*',
}

//endregion Routes


//region Role Constants
const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
}
//endregion Role Constants

//region DB Keys (Backend Response Keys)
const DB_KEYS = {
    USER_ID: 'User-Id',
    NAME: 'Name',
    EMAIL_ADDRESS: 'Email-Address',
    ROLE: 'Role',

    MOVIE_ID: 'Movie-Id',
    TITLE: 'Title',
    LANGUAGE: 'Language',
    GENRES: 'Genres',
    RELEASE_YEAR: 'Release-Year',

    IS_DELETED: 'Is-Deleted',
}
//endregion DB Keys (Backend Response Keys)

//region Validation Regex
const VALIDATION_REGEX = {
    // Name: 2-20 chars, alphabets + space + dot allowed
    NAME: /^[A-Za-z][A-Za-z .'-]{2,20}$/,

    // Email: strong regex (industry standard)
    EMAIL:
        /^[a-zA-Z0-9._ % +-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // Password:
    // 8-20 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,20}$/,

    // Movie title: 1-40 chars, letters numbers and common symbols
    MOVIE_TITLE: /^[A-Za-z0-9 .,'"!?:;()\-&]{1,40}$/,

    // Genre: 1-30 chars, uppercase + hyphen only (ex: SCI-FI)
    GENRE: /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/,

    // Language: uppercase words only
    LANGUAGE: /^[A-Z]+(?:-[A-Z]+)*$/,
}
//endregion Validation Regex

//region Static Options
const LANGUAGE_OPTIONS = [
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

const GENRE_OPTIONS = [
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
//endregion Static Options


// *CSS Height , Width Values
const NAVBAR_HEIGHT = '56px';
const SIDEBAR_WIDTH = '250px';
const SIDEBAR_COLLAPSED_WIDTH = '60px';


//region Export
export { APP_CONSTANTS, API_CONSTANTS, ROUTE_PATHS, ROLES, DB_KEYS, VALIDATION_REGEX, LANGUAGE_OPTIONS, GENRE_OPTIONS, NAVBAR_HEIGHT, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH }
//endregion Export
