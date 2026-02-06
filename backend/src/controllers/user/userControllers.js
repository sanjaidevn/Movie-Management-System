//region Imports
import {
    getUserQuery,
    updateUserProfileQuery,
    changePasswordQuery,
} from '../../queries/user/userQueries.js'

import {
    HTTP_STATUS_CODES,
    HTTP_STATUS_MESSAGES,
    RESPONSE_MESSAGES,
} from '../../utils/constants.js'

import { buildApiResponse } from '../../utils/commonFunctions.js'

// * Importing Validators (used INSIDE controller now)
import {
    validateUpdateProfileBody,
    validateChangePasswordBody,
} from '../../validators/user/userValidators.js'
//endregion Imports

//region Get Me Controller
// * getUser Controller Function
// * Fetches the authenticated user's own profile data.
// * Uses the userId decoded from the authentication middleware.
const getUser = async (req, res, next) => {
    try {
        const userId = req?.user?.userId ?? ''

        const user = await getUserQuery?.({
            userId: userId ?? '',
        })

        // * Return a safe response if the user ID does not exist in the database
        if (!user?.['User-Id']) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.NOT_FOUND,
                status: HTTP_STATUS_MESSAGES?.NOT_FOUND,
                message: 'User not found',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.NOT_FOUND)
                ?.send?.(response)
        }

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.PROFILE_FETCHED,
            response: {
                user: user ?? {},
            },
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Get Me Controller

//region Update Profile Controller
// * updateUserProfile Controller Function
// * Handles updates to the authenticated user's profile information (name, email).
const updateUserProfile = async (req, res, next) => {
    try {
        // * Validate request body inside controller
        const validationResult = validateUpdateProfileBody?.(req ?? {})

        if (!validationResult?.isValid) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: RESPONSE_MESSAGES?.VALIDATION_FAILED,
                response: {
                    errors: validationResult?.errors ?? {},
                },
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        const userId = req?.user?.userId ?? ''
        const body = validationResult?.cleaned ?? {}

        // * Passes partial update data to the query layer
        const updated = await updateUserProfileQuery?.({
            userId: userId ?? '',
            name: body?.name,
            email: body?.email,
        })

        if (!updated?.['User-Id']) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.NOT_FOUND,
                status: HTTP_STATUS_MESSAGES?.NOT_FOUND,
                message: 'User not found',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.NOT_FOUND)
                ?.send?.(response)
        }

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.PROFILE_UPDATED,
            response: {
                user: updated ?? {},
            },
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Update Profile Controller

//region Change Password Controller
// * changePassword Controller Function
// * Facilitates password changes by validating the current password before applying the new one.
const changePassword = async (req, res, next) => {
    try {
        // * Validate request body inside controller
        const validationResult = validateChangePasswordBody?.(req ?? {})

        if (!validationResult?.isValid) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: RESPONSE_MESSAGES?.VALIDATION_FAILED,
                response: {
                    errors: validationResult?.errors ?? {},
                },
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        const userId = req?.user?.userId ?? ''
        const body = validationResult?.cleaned ?? {}

        // * Query layer handles Argon2 verification and re-hashing
        const result = await changePasswordQuery?.({
            userId: userId ?? '',
            currentPassword: body?.currentPassword ?? '',
            newPassword: body?.newPassword ?? '',
        })

        // * Handle errors such as "Incorrect Current Password"
        if (!result?.ok) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message: result?.message ?? 'Password update failed',
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.PASSWORD_UPDATED,
            response: {},
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Change Password Controller

//region Export
export { getUser, updateUserProfile, changePassword }
//endregion Export
