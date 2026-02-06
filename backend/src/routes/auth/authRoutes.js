//region Imports
import express from 'express'

import { register, login, logout } from '../../controllers/auth/authControllers.js'

import { validatorMiddleware } from '../../middlewares/validator/validatorMiddleware.js'
import { authMiddleware } from '../../middlewares/auth/authMiddleware.js'


import { registerRateLimit } from '../../middlewares/rateLimit/registerRateLimiter.js'
import { loginRateLimit } from '../../middlewares/rateLimit/loginRateLimiter.js'

import { adminRegisterGate } from '../../middlewares/admin/adminRegisterGate.js'
//endregion Imports

//region Router
const router = express?.Router?.()
//endregion Router

//region Auth Routes
router?.post?.('/register', registerRateLimit, validatorMiddleware, register)

router?.post?.('/login', loginRateLimit, validatorMiddleware, login)

router?.post?.('/logout', authMiddleware, logout)

//region Admin Register Route
// * Frontend will use this route for admin signup
// * First admin can be created publicly
// * Next admins require admin login (authMiddleware enforced by gate + controller check)
router?.post?.(
    '/admin/register',
    registerRateLimit,
    adminRegisterGate,
    validatorMiddleware,
    register,
)

//endregion Admin Register Route
//endregion Auth Routes

export { router as authRoutes }
