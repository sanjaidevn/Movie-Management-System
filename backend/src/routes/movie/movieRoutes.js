//region Imports
import express from 'express'

import {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getStats,
} from '../../controllers/movie/movieControllers.js'

import { authMiddleware } from '../../middlewares/auth/authMiddleware.js'
import { adminOnlyMiddleware } from '../../middlewares/admin/adminOnlyMiddleware.js'

import { validatorMiddleware } from '../../middlewares/validator/validatorMiddleware.js'
//endregion Imports

//region Router
const router = express?.Router?.()
//endregion Router

//region Movie Routes

// * Get Movies (Query validation happens inside controller)
router?.get?.(
    '/',
    authMiddleware,
    getMovies
)

// * Admin Stats
router?.get?.(
    '/admin/stats',
    authMiddleware,
    adminOnlyMiddleware,
    getStats
)

// * Get Movie By Id
router?.get?.(
    '/:movieId',
    authMiddleware,
    // validateCustomIdParam?.('movieId'),
    getMovieById
)

// * Admin Create Movie
router?.post?.(
    '/',
    authMiddleware,
    adminOnlyMiddleware,
    validatorMiddleware,
    createMovie
)

// * Admin Update Movie
router?.put?.(
    '/:movieId',
    authMiddleware,
    adminOnlyMiddleware,
    // validateCustomIdParam?.('movieId'),
    validatorMiddleware,
    updateMovie
)

// * Admin Delete Movie
router?.delete?.(
    '/:movieId',
    authMiddleware,
    adminOnlyMiddleware,
    // validateCustomIdParam?.('movieId'),
    deleteMovie
)

//endregion Movie Routes

export { router as movieRoutes }
