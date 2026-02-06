//region Imports
import { buildApiResponse } from '../../utils/commonFunctions.js'
import {
    HTTP_STATUS_CODES,
    HTTP_STATUS_MESSAGES,
    RESPONSE_MESSAGES,
} from '../../utils/constants.js'
//endregion Imports

//region Validator Middleware
// * validatorMiddleware
// * Responsible ONLY for:
// * 1. Validating JSON content-type
// * 2. Ensuring request body is a valid JSON object
// * 3. Catching malformed JSON errors
const validatorMiddleware = (req, res, next) => {
    try {
        // * Validate Content-Type (only when body is expected)
        const isJsonRequest =
            req?.headers?.['content-type']
                ?.toLowerCase?.()
                ?.includes?.('application/json') ?? false

        if (!isJsonRequest) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.UNSUPPORTED_MEDIA_TYPE,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message:
                    RESPONSE_MESSAGES?.INVALID_CONTENT_TYPE ??
                    'Content-Type must be application/json',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.UNSUPPORTED_MEDIA_TYPE)
                ?.send?.(response)
        }

        // * Ensure body exists and is an object
        const body = req?.body ?? null

        const isValidJsonObject =
            body !== null &&
            typeof body === 'object' &&
            !Array?.isArray?.(body)

        if (!isValidJsonObject) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message:
                    RESPONSE_MESSAGES?.INVALID_JSON ??
                    'Invalid JSON payload',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        return next?.()
    } catch (error) {
        // * Catch malformed JSON parsing errors (thrown by express.json)
        if (
            error?.type === 'entity.parse.failed' ||
            error instanceof SyntaxError
        ) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message:
                    RESPONSE_MESSAGES?.INVALID_JSON ??
                    'Malformed JSON payload',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        return next?.(error)
    }
}
//endregion Validator Middleware

//region Export
export { validatorMiddleware }
//endregion Export
