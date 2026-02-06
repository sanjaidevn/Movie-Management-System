//region Imports
import { buildApiResponse, logger } from '../../utils/commonFunctions.js'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from '../../utils/constants.js'
//endregion Imports

//region Global Error Handler Middleware
const errorHandlerMiddleware = (error, req, res, next) => {
    try {
        logger?.error?.('GLOBAL ERROR:', error?.message ?? error)

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
            status: HTTP_STATUS_MESSAGES?.FAILED,
            message: error?.message ?? 'Bad Request',
            response: {},
        })

        return res?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)?.send?.(response)
    } catch (err) {
        return res?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)?.send?.({
            statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
            status: HTTP_STATUS_MESSAGES?.FAILED,
            message: err,
            response: {},
        })
    }
}
//endregion Global Error Handler Middleware

export { errorHandlerMiddleware }
