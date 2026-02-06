//region Imports

// * Redux Toolkit utilities for slice creation and asynchronous action handling
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// * API service functions for fetching and updating the current user's profile and credentials
import { getMeApi, updateMeApi, changePasswordApi } from '../../api/user/userApi.js'

//endregion Imports


//region Initial State
const initialState = {
    profile: {},
    loading: false,
    error: '',
}
//endregion Initial State

//region Get Me Thunk
const getUserThunk = createAsyncThunk('user/getMe', async (_, thunkAPI) => {
    try {
        const res = await getMeApi?.()

        // Unauthorized Handling
        if (res?.unauthorized) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: true, message: 'Unauthorized' })
        }

        if (!res?.ok) {
            return thunkAPI?.rejectWithValue?.({
                unauthorized: false,
                message: res?.data?.message ?? 'Failed to fetch profile',
            })
        }

        return res?.data?.response?.user ?? {}
    } catch (error) {
        return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: 'Failed to fetch profile' })
    }
})
//endregion Get Me Thunk

//region Update Profile Thunk
const updateProfileThunk = createAsyncThunk('user/updateProfile', async (payload, thunkAPI) => {
    try {
        const res = await updateMeApi?.(payload ?? {})

        // Unauthorized Handling
        if (res?.unauthorized) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: true, message: 'Unauthorized' })
        }

        if (!res?.ok) {
            return thunkAPI?.rejectWithValue?.({
                unauthorized: false,
                message: res?.data?.message ?? 'Profile update failed',
            })
        }

        return res?.data?.response?.user ?? {}
    } catch (error) {
        return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: 'Profile update failed' })
    }
})
//endregion Update Profile Thunk

//region Change Password Thunk
const changePasswordThunk = createAsyncThunk('user/changePassword', async (payload, thunkAPI) => {
    try {
        const res = await changePasswordApi?.(payload ?? {})

        //Unauthorized Handling
        if (res?.unauthorized) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: true, message: 'Unauthorized' })
        }

        if (!res?.ok) {
            return thunkAPI?.rejectWithValue?.({
                unauthorized: false,
                message: res?.data?.message ?? 'Password update failed',
            })
        }

        return true
    } catch (error) {
        return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: 'Password update failed' })
    }
})
//endregion Change Password Thunk

//region Slice
const userSlice = createSlice?.({
    name: 'user',
    initialState: initialState ?? {},
    reducers: {
        clearUserError: (state) => {
            state.error = ''
        },
    },
    extraReducers: (builder) => {
        builder
            //region Get Me
            ?.addCase?.(getUserThunk?.pending, (state) => {
                state.loading = true
                state.error = ''
            })
            ?.addCase?.(getUserThunk?.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action?.payload ?? {}
            })
            ?.addCase?.(getUserThunk?.rejected, (state, action) => {
                state.loading = false
                state.error = action?.payload?.message ?? 'Failed to fetch profile'
            })
            //endregion Get Me

            //region Update Profile
            ?.addCase?.(updateProfileThunk?.pending, (state) => {
                state.loading = true
                state.error = ''
            })
            ?.addCase?.(updateProfileThunk?.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action?.payload ?? {}
            })
            ?.addCase?.(updateProfileThunk?.rejected, (state, action) => {
                state.loading = false
                state.error = action?.payload?.message ?? 'Profile update failed'
            })
            //endregion Update Profile

            //region Change Password
            ?.addCase?.(changePasswordThunk?.pending, (state) => {
                state.loading = true
                state.error = ''
            })
            ?.addCase?.(changePasswordThunk?.fulfilled, (state) => {
                state.loading = false
            })
            ?.addCase?.(changePasswordThunk?.rejected, (state, action) => {
                state.loading = false
                state.error = action?.payload?.message ?? 'Password update failed'
            })
        //endregion Change Password
    },
})
//endregion Slice

//region Selectors
const selectUserProfile = (state) => state?.user?.profile ?? {}
const selectUserLoading = (state) => state?.user?.loading ?? false
const selectUserError = (state) => state?.user?.error ?? ''
//endregion Selectors

//region Export
const userReducer = userSlice?.reducer

export {
    userReducer,
    getUserThunk,
    updateProfileThunk,
    changePasswordThunk,
    selectUserProfile,
    selectUserLoading,
    selectUserError,
}

export const { clearUserError, setAuthChecked } = userSlice?.actions
//endregion Export
