import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES, RESPONSE_MESSAGES } from "../../utils/constants.js"
import { env } from "../../config/env/env.js"

//region Health Route handler
// * Simple health check endpoint handler
export const healthRoute = (req, res) => {
    return res?.status?.(HTTP_STATUS_CODES.OK)?.send?.({
        statusCode: HTTP_STATUS_CODES.OK,
        status: HTTP_STATUS_MESSAGES.SUCCESS,
        message: RESPONSE_MESSAGES.SERVER_HEALTHY,
        response: {
            env: env?.NODE_ENV ?? 'development',
        },
    })
}
//endregion Health Route handler
