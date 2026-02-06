//region Imports
import express from 'express'

import { authRoutes } from './auth/authRoutes.js'
import { userRoutes } from './user/userRoutes.js'
import { movieRoutes } from './movie/movieRoutes.js'
import { activityLogRoutes } from './activityLog/activityLogRoutes.js'
//endregion Imports

//region Router
const router = express?.Router?.()
//endregion Router

//region Routes
router?.use?.('/auth', authRoutes)
router?.use?.('/users', userRoutes)
router?.use?.('/movies', movieRoutes)
router?.use?.('/activity-logs', activityLogRoutes)
//endregion Routes

export { router as appRoutes }
