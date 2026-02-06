//region Imports
import argon2 from 'argon2'

import { UserModel } from '../../models/user/userModel.js'
import { signToken } from '../../utils/jwtUtils.js'
import { toLowerTrim, trimString } from '../../utils/commonFunctions.js'
//endregion Imports

//region Register Query
// * registerQuery Function
// * Handles new user account creation logic.
// * Checks for email duplicates, hashes passwords using Argon2, 
// * and generates a JWT for the new session.
const registerQuery = async ({ name = '', email = '', password = '', role = 'user' } = {}) => {
    try {
        const safeEmail = toLowerTrim(email ?? '')
        const safeRole = toLowerTrim(role ?? 'user')

        // * Verify if a non-deleted user already exists with the provided email
        const existing = await UserModel?.findOne?.({
            'Email-Address': safeEmail ?? '',
            'Is-Deleted': 0,
        })?.lean?.()

        if (existing?.['User-Id']) {
            return {
                ok: false,
                message: 'Email already exists',
                response: {},
            }
        }

        // * Securely hash the plain-text password before database storage
        const passwordHash = await argon2?.hash?.(password ?? '')

        // * Create the user record with sanitized inputs
        const user = await UserModel?.create?.({
            Name: trimString(name ?? ''),
            'Email-Address': safeEmail ?? '',
            'Hashed-Password': passwordHash ?? '',
            Role: safeRole ?? 'user',
            'Is-Deleted': 0,
        })

        // * Generate a signed JWT containing basic user identification
        const token = signToken?.({
            userId: user?.['User-Id'] ?? '',
            email: user?.['Email-Address'] ?? '',
            role: user?.Role ?? 'user',
        })

        return {
            ok: true,
            message: 'Registered successfully',
            token: token ?? '',
            user: {
                'User-Id': user?.['User-Id'] ?? '',
                Name: user?.Name ?? '',
                'Email-Address': user?.['Email-Address'] ?? '',
                Role: user?.Role ?? 'user',
            },
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'Registration failed',
            response: {},
        }
    }
}
//endregion Register Query

//region Login Query
// * loginQuery Function
// * Validates user credentials for authentication.
// * Verifies the Argon2 password hash and returns a session token on success.
const loginQuery = async ({ email = '', password = '' } = {}) => {
    try {
        const safeEmail = toLowerTrim(email ?? '')

        // * Locate the user by email, ensuring they are not marked as deleted
        const user = await UserModel?.findOne?.({
            'Email-Address': safeEmail ?? '',
            'Is-Deleted': 0,
        })

        // * Generic error message used for security to prevent email enumeration
        if (!user?.['User-Id']) {
            return {
                ok: false,
                message: 'Invalid email or password',
                response: {},
            }
        }

        // * Compare the provided password against the stored hash
        const isMatch = await argon2?.verify?.(user?.['Hashed-Password'] ?? '', password ?? '')

        if (!isMatch) {
            return {
                ok: false,
                message: 'Invalid email or password',
                response: {},
            }
        }

        // * Generate a signed JWT for the authenticated session
        const token = signToken?.({
            userId: user?.['User-Id'] ?? '',
            email: user?.['Email-Address'] ?? '',
            role: user?.Role ?? 'user',
        })

        return {
            ok: true,
            message: 'Login successful',
            token: token ?? '',
            user: {
                'User-Id': user?.['User-Id'] ?? '',
                Name: user?.Name ?? '',
                'Email-Address': user?.['Email-Address'] ?? '',
                Role: user?.Role ?? 'user',
            },
        }
    } catch (error) {
        return {
            ok: false,
            message: 'Login failed',
            response: {},
        }
    }
}
//endregion Login Query

//region Export
export { registerQuery, loginQuery }
//endregion Export
