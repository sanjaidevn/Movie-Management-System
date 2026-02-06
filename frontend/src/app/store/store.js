//region Imports

// * Utility for setting up a Redux store with simplified configuration and middleware
import { configureStore } from '@reduxjs/toolkit'

// * Reducer for managing authentication state and user sessions
import { authReducer } from '../../redux/auth/authSlice.js'
// * Reducer for managing profile data and user-specific information
import { userReducer } from '../../redux/user/userSlice.js'
// * Reducer for managing movie collection data and CRUD states
import { movieReducer } from '../../redux/movie/movieSlice.js'
// * Reducer for tracking system activity and audit logs
import { activityLogsReducer } from '../../redux/activityLogs/activityLogsSlice.js'

//endregion Imports


//region Store
const store = configureStore?.({
    reducer: {
        auth: authReducer,
        user: userReducer,
        movies: movieReducer,
        activityLogs: activityLogsReducer,
    },
})
//endregion Store

export { store }
