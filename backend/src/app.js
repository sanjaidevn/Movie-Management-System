// region Imports

// * Express framework for creating HTTP server and routing
import express from 'express'

// * CORS middleware for handling cross-origin requests
import cors from 'cors'

// * Middleware for parsing cookies from incoming requests
import cookieParser from 'cookie-parser'

// * Custom CORS configuration options
import { corsOptions } from './config/cors/corsOptions.js'

// * API logger middleware for logging request details
import { apiLoggerMiddleware } from './middlewares/logger/apiLoggerMiddleware.js'

// * Centralized application routes
import { appRoutes } from './routes/routes.js'

// * Health check route handler
import { healthRoute } from './routes/health/healthRoute.js'

// * Middleware to handle unknown routes
import { notFoundMiddleware } from './middlewares/error/notFoundMiddleware.js'

// * Global error-handling middleware
import { errorHandlerMiddleware } from './middlewares/error/errorHandlerMiddleware.js'

// endregion Imports

// region App Init

// * Initialize Express application instance safely
const app = express?.()

// endregion App Init

// region Middlewares

// * Enable CORS with configured options and fallback object
app?.use?.(cors?.(corsOptions ?? {}))

// * Enable cookie parsing for incoming requests
app?.use?.(cookieParser?.())

// * Enable JSON body parsing with size limit
app?.use?.(express?.json?.({ limit: '1mb' }))

// * Enable URL-encoded body parsing with extended syntax
app?.use?.(express?.urlencoded?.({ extended: true }))

// * Attach API logger to log all incoming API requests
app?.use?.(apiLoggerMiddleware)

// endregion Middlewares

// region Health Check

// * Expose health check endpoint for uptime monitoring
app?.get?.('/health', healthRoute)

// endregion Health Check

// region Routes

// * Mount application routes under /api prefix
app?.use?.('/api', appRoutes)

// endregion Routes

// region Not Found

// * Handle requests to undefined routes
app?.use?.(notFoundMiddleware)

// endregion Not Found

// region Error Handler

// * Centralized error-handling middleware
app?.use?.(errorHandlerMiddleware)

// endregion Error Handler

// region Export

// * Export Express app instance for server bootstrap
export { app }

// endregion Export
