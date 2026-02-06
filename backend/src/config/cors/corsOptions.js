//region Imports
import { env } from '../env/env.js'
//endregion Imports

//region CORS Options
const corsOptions = {
    origin: env?.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
//endregion CORS Options

export { corsOptions }
