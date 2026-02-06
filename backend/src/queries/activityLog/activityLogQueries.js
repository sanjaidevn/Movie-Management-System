//region Imports
import { ActivityLogModel } from '../../models/activityLog/activityLogModel.js'
//endregion Imports

//region Create Log Query
const createLogQuery = async ({
    activityType = '',
    method = '',
    url = '',
    statusCode = 0,
    ip = '',
    userAgent = '',
    userId = '',
    userEmail = '',
    role = '',
    requestBody = {},
    query = {},
    params = {},
    responseBody = {},
    durationMs = 0,
} = {}) => {
    try {
        const log = await ActivityLogModel?.create?.({
            'Activity-Type': activityType ?? '',
            Method: method ?? '',
            Url: url ?? '',
            'Status-Code': statusCode ?? 0,
            Ip: ip ?? '',
            'User-Agent': userAgent ?? '',
            'User-Id': userId ?? '',
            'User-Email': userEmail ?? '',
            Role: role ?? '',
            'Request-Body': requestBody ?? {},
            Query: query ?? {},
            Params: params ?? {},
            'Response-Body': responseBody ?? {},
            'Duration-Ms': durationMs ?? 0,
        })
        return log ?? null
    } catch (error) {
        return null
    }
}
//endregion Create Log Query

//region Get Logs Query (Pagination)
const getLogsQuery = async ({ page = 1, limit = 10 } = {}) => {
    try {
        const safePage = Number(page ?? 1) || 1
        const safeLimit = Number(limit ?? 10) || 10
        const skip = (safePage - 1) * safeLimit

        const logs = await ActivityLogModel?.find?.({})
            ?.sort?.({ 'Created-At': -1 })
            ?.skip?.(skip ?? 0)
            ?.limit?.(safeLimit ?? 10)
            ?.lean?.()

        const total = await ActivityLogModel?.countDocuments?.({})

        return {
            logs: logs ?? [],
            total: total ?? 0,
            page: safePage ?? 1,
            limit: safeLimit ?? 10,
        }
    } catch (error) {
        return {
            logs: [],
            total: 0,
            page: 1,
            limit: 10,
        }
    }
}
//endregion Get Logs Query (Pagination)

//region Export
export { createLogQuery, getLogsQuery }
//endregion Export
