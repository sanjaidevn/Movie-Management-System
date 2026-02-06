//region Imports
import jwt from 'jsonwebtoken'
import { env } from '../config/env/env.js'
//endregion Imports

//region Sign Token
const signToken = (payload = {}) => {
    try {
        return jwt?.sign?.(payload ?? {}, env?.JWT_SECRET ?? '', {
            expiresIn: env?.JWT_EXPIRES_IN ?? '1d',
        })
    } catch (error) {
        return ''
    }
}
//endregion Sign Token

//region Verify Token
const verifyToken = (token = '') => {
    try {
        return jwt?.verify?.(token ?? '', env?.JWT_SECRET ?? '')
    } catch (error) {
        return null
    }
}
//endregion Verify Token

//region Export
export { signToken, verifyToken }
//endregion Export
