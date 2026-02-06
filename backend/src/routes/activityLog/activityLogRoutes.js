//region Imports
import express from 'express'

import { getLogs } from '../../controllers/activityLog/activityLogControllers.js'

import { authMiddleware } from '../../middlewares/auth/authMiddleware.js'
import { adminOnlyMiddleware } from '../../middlewares/admin/adminOnlyMiddleware.js'
//endregion Imports

//region Router
const router = express?.Router?.()
//endregion Router

//region Activity Log Routes
router?.get?.('/', authMiddleware, adminOnlyMiddleware, getLogs)
//endregion Activity Log Routes

export { router as activityLogRoutes }
