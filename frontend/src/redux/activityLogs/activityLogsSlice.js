//region Imports

// * Functions to create Redux state slices and handle asynchronous logic
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// * API service for fetching system activity and user logs
import { getActivityLogsApi } from '../../api/activityLogs/activityLogsApi.js'

//endregion Imports


//region Initial State
const initialState = {
    logs: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: '',
}
//endregion Initial State

//region Get Logs Thunk
// * getLogsThunk
// * Fetches paginated activity logs from the server.
const getLogsThunk = createAsyncThunk('activityLogs/getLogs', async (payload, thunkAPI) => {
    try {
        const res = await getActivityLogsApi?.(payload ?? {})

        // * If session is invalid, pass unauthorized flag to global auth handler
        if (res?.unauthorized) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: true, message: 'Unauthorized' })
        }

        if (!res?.ok) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: res?.data?.message ?? 'Failed to fetch logs' })
        }

        return res?.data?.response ?? {}
    } catch (error) {
        return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: 'Failed to fetch logs' })
    }
})
//endregion Get Logs Thunk

//region Slice
// * activityLogsSlice
// * Manages the state for system audit logs, including pagination metadata.
const activityLogsSlice = createSlice?.({
    name: 'activityLogs',
    initialState: initialState ?? {},
    reducers: {
        // * Resets the local error state
        clearLogsError: (state) => {
            state.error = ''
        },
    },
    extraReducers: (builder) => {
        builder
            // * Sets loading state and clears previous errors before fetching
            ?.addCase?.(getLogsThunk?.pending, (state) => {
                state.loading = true
                state.error = ''
            })
            // * Populates logs and updates pagination details from API response
            ?.addCase?.(getLogsThunk?.fulfilled, (state, action) => {
                state.loading = false
                state.logs = action?.payload?.logs ?? []
                state.total = action?.payload?.total ?? 0
                state.page = action?.payload?.page ?? 1
                state.limit = action?.payload?.limit ?? 10
            })
            // * Handles failed log fetches and stores the error message
            ?.addCase?.(getLogsThunk?.rejected, (state, action) => {
                state.loading = false
                state.error = action?.payload?.message ?? 'Failed to fetch logs'
            })
    },
})
//endregion Slice

//region Selectors
// * Selectors for consuming activity log data within React components
const selectLogs = (state) => state?.activityLogs?.logs ?? []
const selectLogsTotal = (state) => state?.activityLogs?.total ?? 0
const selectLogsLoading = (state) => state?.activityLogs?.loading ?? false
const selectLogsError = (state) => state?.activityLogs?.error ?? ''
//endregion Selectors

//region Export
const activityLogsReducer = activityLogsSlice?.reducer

export { activityLogsReducer, getLogsThunk, selectLogs, selectLogsTotal, selectLogsLoading, selectLogsError }

export const { clearLogsError } = activityLogsSlice?.actions

export default activityLogsReducer
//endregion Export
