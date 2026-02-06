//region Imports
import express from 'express'

import {
    getUser,
    updateUserProfile,
    changePassword,
} from '../../controllers/user/userControllers.js'

import { authMiddleware } from '../../middlewares/auth/authMiddleware.js'
import { validatorMiddleware } from '../../middlewares/validator/validatorMiddleware.js'
import { registerRateLimit } from '../../middlewares/rateLimit/registerRateLimiter.js'
//endregion Imports

//region Router
const router = express?.Router?.()
//endregion Router

//region User Routes

// * Get own profile
router?.get?.(
    '/me',
    authMiddleware,
    getUser
)

// * Update own profile (business validation handled inside controller)
router?.put?.(
    '/me',
    authMiddleware,
    validatorMiddleware,
    updateUserProfile
)

// * Change password
router?.put?.(
    '/me/change-password',
    authMiddleware,
    registerRateLimit,
    validatorMiddleware,
    changePassword
)

//endregion User Routes

export { router as userRoutes }
