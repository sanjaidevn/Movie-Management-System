//region Imports
import { REGEX } from '../../utils/constants.js'
import { trimString, toLowerTrim, isFalsyValue } from '../../utils/commonFunctions.js'
//endregion Imports

//region Register Body Validator
// * validateRegisterBody Function
// * Validates the incoming registration request body against business rules.
// * Checks for required fields, regex patterns, password matching, and permitted roles.
const validateRegisterBody = (req) => {
    try {
        const body = req?.body ?? {}

        // * Sanitize inputs before validation to ensure consistent checks
        const name = trimString(body?.name ?? '')
        const email = toLowerTrim(body?.email ?? '')
        const password = trimString(body?.password ?? '')
        const confirmPassword = trimString(body?.confirmPassword ?? '')
        const role = trimString(body?.role ?? 'user')

        const errors = {}

        // * Name validation: Ensures name exists and follows standard character patterns
        if (isFalsyValue?.({ value: name })) {
            errors.name = 'Name is required'
        } else if (!(REGEX?.NAME?.test?.(name ?? ''))) {
            errors.name = 'Name format is invalid'
        } else if ((name ?? '')?.length > 20) {
            errors.name = 'Name must be at most 20 characters'
        }

        // * Email validation: Checks for proper email structure via regex
        if (!email) {
            errors.email = 'Email is required'
        } else if (!(REGEX?.EMAIL?.test?.(email ?? ''))) {
            errors.email = 'Email format is invalid'
        } else if ((email ?? '')?.length > 40) {
            errors.email = 'Email must be at most 40 characters'
        }

        // * Password validation: Enforces strict complexity requirements for security
        if (!password) {
            errors.password = 'Password is required'
        } else if (!(REGEX?.PASSWORD?.test?.(password ?? ''))) {
            errors.password =
                'Password must contain uppercase, lowercase, number, special character and length 8-32'
        }

        // * Confirm Password validation: Ensures equality between both password entries
        if (!confirmPassword) {
            errors.confirmPassword = 'Confirm password is required'
        } else if ((confirmPassword ?? '') !== (password ?? '')) {
            errors.confirmPassword = 'Passwords do not match'
        }

        // * Role validation: Only allows specifically defined system roles
        if (!role) {
            errors.role = 'Role is required'
        } else if (!['user', 'admin']?.includes?.(role ?? '')) {
            errors.role = 'Role must be user or admin'
        }

        // * Determine validity by the absence of error keys
        const isValid = Object?.keys?.(errors ?? {})?.length === 0

        return {
            isValid: isValid ?? false,
            errors: errors ?? {},
            cleaned: {
                name: name ?? '',
                email: email ?? '',
                password: password ?? '',
                confirmPassword: confirmPassword ?? '',
                role: role ?? 'user',
            },
        }
    } catch (error) {
        return { isValid: false, errors: { general: 'Validation failed' }, cleaned: {} }
    }
}
//endregion Register Body Validator

//region Login Body Validator
// * validateLoginBody Function
// * Performs a shallow validation of login credentials.
// * Full authentication happens later in the query layer.
const validateLoginBody = (req) => {
    try {
        const body = req?.body ?? {}

        const email = toLowerTrim(body?.email ?? '')
        const password = trimString(body?.password ?? '')

        const errors = {}

        // * Basic email presence and format check
        if (!email) {
            errors.email = 'Email is required'
        } else if (!(REGEX?.EMAIL?.test?.(email ?? ''))) {
            errors.email = 'Email format is invalid'
        } else if ((email ?? '')?.length > 40) {
            errors.email = 'Email must be at most 40 characters'
        }

        // * Simple existence check for password
        if (!password) {
            errors.password = 'Password is required'
        }

        const isValid = Object?.keys?.(errors ?? {})?.length === 0

        return {
            isValid: isValid ?? false,
            errors: errors ?? {},
            cleaned: {
                email: email ?? '',
                password: password ?? '',
            },
        }
    } catch (error) {
        return { isValid: false, errors: { general: 'Validation failed' }, cleaned: {} }
    }
}
//endregion Login Body Validator

//region Export
export { validateRegisterBody, validateLoginBody }
//endregion Export
