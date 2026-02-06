//region Imports

// * Redux Toolkit utilities for creating state slices and handling async actions
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// * API functions for authentication processes including login, registration, and logout
import { loginApi, registerApi, logoutApi, adminRegisterApi, adminLoginApi } from '../../api/auth/authApi.js'
// * Utility function to ensure safe object access and prevent undefined errors
import { safeObject } from '../../utils/commonFunctions.js'

//endregion Imports


//region Initial State
const initialState = {
    user: null,
    loading: false,
    createAdminLoading: false,
    error: '',
    isAuthenticated: false,
};

//endregion Initial State

//region Login Thunk (User)
// * loginThunk
// * Handles standard user login. 
// * Transforms successful API responses into a sanitized user object.
const loginThunk = createAsyncThunk('auth/login', async (payload = {}, thunkAPI) => {
    try {
        const res = await loginApi?.(payload ?? {})

        // * Handle token expiration
        if (res?.unauthorized) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: true, message: 'Unauthorized' })
        }

        const data = res?.data ?? {}

        if (!res?.ok) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: data?.message ?? 'Login failed' })
        }

        return safeObject(data?.response?.user ?? {})
    } catch (error) {
        return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: 'Login failed' })
    }
})
//endregion Login Thunk (User)

//region Register Thunk (User)
// * registerThunk
// * Facilitates public user account creation.
const registerThunk = createAsyncThunk('auth/register', async (payload = {}, thunkAPI) => {
    try {
        const res = await registerApi?.(payload ?? {})

        if (res?.unauthorized) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: true, message: 'Unauthorized' })
        }

        const data = res?.data ?? {}

        if (!res?.ok) {
            return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: data?.message ?? 'Register failed' })
        }

        return safeObject(data?.response?.user ?? {})
    } catch (error) {
        return thunkAPI?.rejectWithValue?.({ unauthorized: false, message: 'Register failed' })
    }
})
//endregion Register Thunk (User)

//region Create Admin Thunk
// * createAdminThunk
// * Used by existing admin to create another admin
// * DOES NOT log in the new admin
const createAdminThunk = createAsyncThunk(
    'auth/createAdmin',
    async (payload = {}, thunkAPI) => {
        try {
            const res = await adminRegisterApi?.(payload ?? {});

            // Unauthorized (current admin session invalid)
            if (res?.unauthorized) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: true,
                    message: 'Unauthorized',
                });
            }

            const data = res?.data ?? {};

            // Server-side validation / duplicate admin 
            if (!res?.ok) {
                return thunkAPI?.rejectWithValue?.({
                    unauthorized: false,
                    message: data?.message ?? 'Admin creation failed',
                });
            }

            return data?.response?.user ?? {};
        } catch (error) {
            return thunkAPI?.rejectWithValue?.({
                unauthorized: false,
                message: 'Admin creation failed',
            });
        }
    }
);
//endregion Create Admin Thunk


//region Logout Thunk
// * logoutThunk
// * Calls the backend to clear session cookies and resets the local store.
const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await logoutApi?.()
        return true
    } catch (error) {
        return thunkAPI?.rejectWithValue?.('Logout failed')
    }
})
//endregion Logout Thunk

//region Slice
// * authSlice
// * Manages user identity, session status, and authentication-related UI states.
const authSlice = createSlice({
    name: 'auth',
    initialState: initialState ?? {},
    reducers: {
        // * Resets error strings, typically used when navigating between login/register pages.
        clearAuthError: (state) => {
            state.error = ''
        },

        // * Hydrates the store with user data stored in cookies upon app refresh.
        setAuthUser: (state, action) => {
            state.user = safeObject(action?.payload ?? {})
            state.isAuthenticated = Boolean((action?.payload ?? null))
            state.loading = false
            state.error = ''
        },

        // * Immediate client-side reset, used when API calls return 401/403 errors.
        forceLogout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false
            state.error = ''
        },
    },
    extraReducers: (builder) => {
        builder
            //region Login (User) handlers
            .addCase(loginThunk.pending, (state) => {
                state.loading = true
                state.error = ''
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = safeObject(action?.payload ?? {})
                state.isAuthenticated = true
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false
                state.user = null
                state.isAuthenticated = false
                state.error = action?.payload?.message ?? 'Login failed'
            })
            //endregion Login (User)

            //region Register (User) handlers
            .addCase(registerThunk.pending, (state) => {
                state.loading = true
                state.error = ''
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading = false
                state.user = safeObject(action?.payload ?? {})
                state.isAuthenticated = true
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false
                state.user = null
                state.isAuthenticated = false
                state.error = action?.payload?.message ?? 'Register failed'
            })
            //endregion Register (User)

            //region Register (Admin) handlers
            .addCase(createAdminThunk.pending, (state) => {
                state.createAdminLoading = true;
                state.error = '';
            })
            .addCase(createAdminThunk.fulfilled, (state) => {
                state.createAdminLoading = false;
            })
            .addCase(createAdminThunk.rejected, (state, action) => {
                state.createAdminLoading = false;
                state.error = action?.payload?.message ?? 'Admin creation failed';
            })
            //endregion Register (Admin)

            //region Logout handler: Resets state to defaults
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
                state.loading = false
                state.error = ''
            })
        //endregion Logout
    },
})
//endregion Slice

//region Selectors
// * Standard selectors for consuming auth state in React components via useSelector
const selectAuthUser = (state) => state?.auth?.user ?? null
const selectAuthLoading = (state) => state?.auth?.loading ?? false
const selectAuthError = (state) => state?.auth?.error ?? ''
const selectIsAuthenticated = (state) => state?.auth?.isAuthenticated ?? false
const selectAuthRole = (state) => state?.auth?.user?.Role ?? ''
const selectCreateAdminLoading = (state) => state?.auth?.createAdminLoading ?? false;
//endregion Selectors


//region Export
const { clearAuthError, forceLogout, setAuthUser } = authSlice.actions
const authReducer = authSlice.reducer

export {
    authReducer,
    loginThunk,
    registerThunk,
    createAdminThunk,
    logoutThunk,
    clearAuthError,
    forceLogout,
    setAuthUser,
    selectAuthUser,
    selectAuthLoading,
    selectAuthError,
    selectIsAuthenticated,
    selectAuthRole,
    selectCreateAdminLoading
}
//endregion Export
