//region Imports
import { createLogQuery } from '../../queries/activityLog/activityLogQueries.js'
import { logger } from '../../utils/commonFunctions.js'
//endregion Imports

//region API Logger Middleware
const apiLoggerMiddleware = async (req, res, next) => {
    try {
        const startTime = Date?.now?.() ?? 0

        const originalSend = res?.send

        res.send = function (body) {
            try {
                const endTime = Date?.now?.() ?? 0
                const duration = (endTime ?? 0) - (startTime ?? 0)

                const userId = req?.user?.userId ?? ''
                const userEmail = req?.user?.email ?? ''
                const role = req?.user?.role ?? ''

                const logData = {
                    activityType: 'REQUEST',
                    method: req?.method ?? '',
                    url: req?.originalUrl ?? '',
                    statusCode: res?.statusCode ?? 0,
                    ip: req?.ip ?? '',
                    userAgent: req?.headers?.['user-agent'] ?? '',
                    userId: userId ?? '',
                    userEmail: userEmail ?? '',
                    role: role ?? '',
                    requestBody: req?.body ?? {},
                    query: req?.query ?? {},
                    params: req?.params ?? {},
                    responseBody: body ?? {},
                    durationMs: duration ?? 0,
                }

                createLogQuery?.(logData ?? {})?.catch?.((err) => { })
                logger?.info?.(
                    'API LOG:',
                    req?.method ?? '',
                    req?.originalUrl ?? '',
                    'STATUS:',
                    res?.statusCode ?? 0,
                    'DURATION:',
                    duration ?? 0,
                    'ms'
                )
            } catch (error) {
                // no crash
            }

            return originalSend?.call?.(this, body)
        }

        return next?.()
    } catch (error) {
        return next?.(error)
    }
}
//endregion API Logger Middleware

export { apiLoggerMiddleware }
