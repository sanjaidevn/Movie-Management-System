//region Imports
import { getLogsQuery } from '../../queries/activityLog/activityLogQueries.js'

import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from '../../utils/constants.js'
import { buildApiResponse } from '../../utils/commonFunctions.js'
//endregion Imports

//region Get Logs Controller (Admin)
const getLogs = async (req, res, next) => {
    try {
        const page = req?.query?.page ?? 1
        const limit = req?.query?.limit ?? 10

        const result = await getLogsQuery?.({
            page: page ?? 1,
            limit: limit ?? 10,
        })

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: 'Logs fetched successfully',
            response: result ?? {},
        })

        return res?.status?.(HTTP_STATUS_CODES?.OK)?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Get Logs Controller (Admin)

//region Export
export { getLogs }
//endregion Export
