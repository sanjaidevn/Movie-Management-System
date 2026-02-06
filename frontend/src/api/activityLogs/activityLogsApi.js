//region Imports
import { apiRequest } from '../../utils/apiHelpers.js'
//endregion Imports

//region Get Activity Logs API (Admin)
const getActivityLogsApi = async ({ page = 1, limit = 10 } = {}) => {
    try {
        return await apiRequest?.({
            path: '/activity-logs',
            method: 'GET',
            params: {
                page: Number(page ?? 1),
                limit: Number(limit ?? 10),
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Get Activity Logs API (Admin)

//region Export
export { getActivityLogsApi }
//endregion Export
