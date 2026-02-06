//region Imports
import mongoose from 'mongoose'

import { env } from '../env/env.js'
import { logger } from '../../utils/commonFunctions.js'
//endregion Imports

//region DB Connect
const connectDB = async () => {
    try {
        const mongoUri = env?.MONGO_URI ?? ''

        logger?.info?.('ENV MONGO_URI:', mongoUri ? 'FOUND' : 'NOT FOUND')

        if (!mongoUri) {
            logger?.error?.('MongoDB URI is missing in env')
            process?.exit?.(1)
        }

        await mongoose?.connect?.(mongoUri ?? '')

        logger?.info?.('MongoDB connected successfully')
    } catch (error) {
        logger?.error?.('MongoDB connection failed:', error?.message ?? error)
        process?.exit?.(1)
    }
}
//endregion DB Connect

export { connectDB }
