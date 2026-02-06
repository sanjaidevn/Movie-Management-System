//region Imports
import { registerQuery, loginQuery } from '../../queries/auth/authQueries.js'

import {
    HTTP_STATUS_CODES,
    HTTP_STATUS_MESSAGES,
    RESPONSE_MESSAGES,
} from '../../utils/constants.js'

import {
    buildApiResponse,
    setAuthCookie,
    clearAuthCookie,
} from '../../utils/commonFunctions.js'

import { UserModel } from '../../models/user/userModel.js'

// * Importing Validators (used INSIDE controller now)
import {
    validateRegisterBody,
    validateLoginBody,
} from '../../validators/auth/authValidators.js'
//endregion Imports

//region Register Controller
// * register Controller Function
// * Orchestrates the user registration process, including role-based access checks,
// * database persistence via queries, and setting secure authentication cookies.
const register = async (req, res, next) => {
    try {
        // * Validate request
        const validationResult = validateRegisterBody?.(req ?? {})

        if (!validationResult?.isValid) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(
                buildApiResponse({
                    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
                    status: HTTP_STATUS_MESSAGES.FAILED,
                    message: RESPONSE_MESSAGES.VALIDATION_FAILED,
                    response: { errors: validationResult.errors ?? {} },
                })
            )
        }

        const body = validationResult.cleaned ?? {}

        // * Default role
        let safeRole = (body?.role ?? 'user').toLowerCase()

        //region Admin Register Restriction
        const existingAdmin = await UserModel.findOne({
            Role: 'admin',
            'Is-Deleted': 0,
        }).select({ _id: 1 }).lean()

        const adminExists = Boolean(existingAdmin)

        // FIRST USER → AUTO ADMIN
        if (!adminExists) {
            safeRole = 'admin'
        }

        // Admin already exists → only admin can create admin
        else if (safeRole === 'admin') {
            if (req?.user?.role !== 'admin') {
                return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send(
                    buildApiResponse({
                        statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
                        status: HTTP_STATUS_MESSAGES.FAILED,
                        message: RESPONSE_MESSAGES.FORBIDDEN ??
                            'Only Admin can create another Admin',
                        response: {},
                    })
                )
            }
        }
        //endregion Admin Register Restriction

        // * Register user
        const result = await registerQuery({
            name: body.name,
            email: body.email,
            password: body.password,
            role: safeRole,
        })

        if (!result?.ok) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(
                buildApiResponse({
                    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
                    status: HTTP_STATUS_MESSAGES.FAILED,
                    message: result.message ?? RESPONSE_MESSAGES.VALIDATION_FAILED,
                    response: result.response ?? {},
                })
            )
        }

        // * Set auth cookie
        setAuthCookie?.(res, result.token ?? '')

        return res.status(HTTP_STATUS_CODES.CREATED).send(
            buildApiResponse({
                statusCode: HTTP_STATUS_CODES.CREATED,
                status: HTTP_STATUS_MESSAGES.SUCCESS,
                message: RESPONSE_MESSAGES.REGISTER_SUCCESS,
                response: { user: result.user ?? {} },
            })
        )

    } catch (error) {
        return next(error)
    }
}
//endregion Register Controller


//region Login Controller
// * login Controller Function
// * Validates user credentials and initiates a secure session.
const login = async (req, res, next) => {
    try {
        // * Perform business validation inside controller
        const validationResult = validateLoginBody?.(req ?? {})

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

        // * Use sanitized & validated data
        const body = validationResult?.cleaned ?? {}

        // * Verify credentials against database records
        const result = await loginQuery?.({
            email: body?.email ?? '',
            password: body?.password ?? '',
        })

        // * Handle authentication failures (wrong email/password)
        if (!result?.ok) {
            const response = buildApiResponse?.({
                statusCode: HTTP_STATUS_CODES?.BAD_REQUEST,
                status: HTTP_STATUS_MESSAGES?.FAILED,
                message:
                    result?.message ??
                    RESPONSE_MESSAGES?.BAD_REQUEST,
                response: {},
            })

            return res
                ?.status?.(HTTP_STATUS_CODES?.BAD_REQUEST)
                ?.send?.(response)
        }

        // * Set the session cookie upon successful authentication
        setAuthCookie?.(res, result?.token ?? '')

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.LOGIN_SUCCESS,
            response: {
                user: result?.user ?? {},
            },
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Login Controller

//region Logout Controller
// * logout Controller Function
// * Terminates the user session by clearing the authentication cookie.
const logout = async (req, res, next) => {
    try {
        // * Remove the JWT cookie from the client browser
        clearAuthCookie?.(res)

        const response = buildApiResponse?.({
            statusCode: HTTP_STATUS_CODES?.OK,
            status: HTTP_STATUS_MESSAGES?.SUCCESS,
            message: RESPONSE_MESSAGES?.LOGOUT_SUCCESS,
            response: {},
        })

        return res
            ?.status?.(HTTP_STATUS_CODES?.OK)
            ?.send?.(response)
    } catch (error) {
        return next?.(error)
    }
}
//endregion Logout Controller

//region Export
export { register, login, logout }
//endregion Export
