//region Imports
import { app } from './app.js'
import { env } from './config/env/env.js'
import { connectDB } from './config/db/db.js'
import { logger } from './utils/commonFunctions.js'
//endregion Imports

//region Server Start
const startServer = async () => {
    try {
        await connectDB?.()

        const port = env?.PORT ?? 5000

        app?.listen?.(port ?? 5000, () => {
            logger?.info?.(`Server running on port ${port ?? 5000}`)
        })
    } catch (error) {
        logger?.error?.('Server failed to start:', error?.message ?? error)
        process?.exit?.(1)
    }
}
//endregion Server Start

startServer?.()
