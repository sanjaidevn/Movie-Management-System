//region Imports
import rateLimit from 'express-rate-limit'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES, RESPONSE_MESSAGES } from '../../utils/constants.js'
import { buildApiResponse } from '../../utils/commonFunctions.js';
//endregion Imports


//region REGISTER RATE LIMITER

// * Rate limiter for register endpoint
// * Prevents abuse during admin registration
const registerRateLimit = rateLimit?.({
    // * Time window for rate limiting : 5 Minutes
    windowMs: 5 * 60 * 1000,

    // * Maximum attempts allowed in window : 10
    max: 10,

    // * Generate key using IP + email
    keyGenerator: (req) => {
        const ip = req?.ip ?? "";
        const email = req?.body?.email ?? "";
        return `${ip}_${email}`;
    },

    // * Custom response when limit is exceeded
    handler: (req, res) => {
        const statusCode = HTTP_STATUS_CODES.TOO_MANY_REQUESTS ?? 429;

        return res
            ?.status?.(statusCode)
            ?.json?.(
                buildApiResponse({
                    statusCode,
                    status: HTTP_STATUS_MESSAGES.FAILED ?? "Failed",
                    message: RESPONSE_MESSAGES.TOO_MANY_REQUESTS ?? "Too many Requests, try again later",
                    response: {}
                })
            );
    },
    standardHeaders: true,
    legacyHeaders: false,
});

//endregion

export { registerRateLimit }
