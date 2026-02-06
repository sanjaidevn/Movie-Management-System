//region Imports
import { verifyToken } from '../../utils/jwtUtils.js'
import { buildApiResponse } from '../../utils/commonFunctions.js'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES, RESPONSE_MESSAGES } from '../../utils/constants.js'
//endregion Imports

//region Auth Middleware
const authMiddleware = (req, res, next) => {
    try {
        const token = req?.cookies?.token ?? ''

        if (!token) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.UNAUTHORIZED,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: RESPONSE_MESSAGES?.UNAUTHORIZED,
                response: {},
            })

            return res?.status?.(HTTP_STATUS_CODES?.UNAUTHORIZED)?.send?.(response)
        }

        const decoded = verifyToken?.(token ?? '')

        if (!decoded?.userId) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.UNAUTHORIZED,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: RESPONSE_MESSAGES?.UNAUTHORIZED,
                response: {},
            })

            return res?.status?.(HTTP_STATUS_CODES?.UNAUTHORIZED)?.send?.(response)
        }
        req.user = {
            userId: decoded?.userId ?? '',
            email: decoded?.email ?? '',
            role: decoded?.role ?? 'user',
        }

        return next?.()
    } catch (error) {
        return next?.(error)
    }
}
//endregion Auth Middleware

export { authMiddleware }
