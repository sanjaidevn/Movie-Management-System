//region Imports
import { buildApiResponse } from '../../utils/commonFunctions.js'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES, RESPONSE_MESSAGES } from '../../utils/constants.js'
//endregion Imports

//region Admin Only Middleware
const adminOnlyMiddleware = (req, res, next) => {
    try {
        const role = req?.user?.role ?? 'user'

        if ((role ?? '') !== 'admin') {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.UNAUTHORIZED,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: RESPONSE_MESSAGES?.FORBIDDEN_ADMIN,
                response: {},
            })

            return res?.status?.(HTTP_STATUS_CODES?.UNAUTHORIZED)?.send?.(response)
        }

        return next?.()
    } catch (error) {
        return next?.(error)
    }
}
//endregion Admin Only Middleware

export { adminOnlyMiddleware }
