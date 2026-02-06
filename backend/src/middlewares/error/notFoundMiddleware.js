//region Imports
import { buildApiResponse } from '../../utils/commonFunctions.js'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES, RESPONSE_MESSAGES } from '../../utils/constants.js'
//endregion Imports

//region Not Found Middleware
const notFoundMiddleware = (req, res, next) => {
    try {
        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.NOT_FOUND,
            status: HTTP_STATUS_MESSAGES?.FAILED,
            message: RESPONSE_MESSAGES?.NOT_FOUND,
            response: {},
        })

        return res?.status?.(HTTP_STATUS_CODES?.NOT_FOUND)?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Not Found Middleware

export { notFoundMiddleware }
