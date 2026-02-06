//region Imports
// * Importing regex patterns used for validating name, email and password formats
import { REGEX } from '../../utils/constants.js'

// * Importing shared helper utilities for sanitization
import { trimString, toLowerTrim } from '../../utils/commonFunctions.js'
//endregion Imports

//region Update Profile Body Validator
// * validateUpdateProfileBody Function
// * Validates update profile payload for authenticated users
// * Supports partial updates (name and/or email)
// * Ensures at least one valid field is provided
const validateUpdateProfileBody = (req = {}) => {
    try {
        // * Safely extract request body
        const body = req?.body ?? {}

        // * Use undefined to detect whether a field was actually sent
        const name =
            body?.name !== undefined
                ? trimString(body?.name ?? '')
                : undefined

        const email =
            body?.email !== undefined
                ? toLowerTrim(body?.email ?? '')
                : undefined

        // * Object to accumulate validation errors
        const errors = {}

        // * Prevent empty update requests
        if (name === undefined && email === undefined) {
            errors.general = 'At least one field is required'
        }

        // * Name validation (only if provided)
        if (name !== undefined) {
            if (!name) {
                errors.name = 'Name is required'
            } else if (!(REGEX?.NAME?.test?.(name ?? '') ?? false)) {
                errors.name = 'Name format is invalid'
            } else if ((name ?? '')?.length > 20) {
                errors.name = 'Name must be at most 20 characters'
            }
        }

        // * Email validation (only if provided)
        if (email !== undefined) {
            if (!email) {
                errors.email = 'Email is required'
            } else if (!(REGEX?.EMAIL?.test?.(email ?? '') ?? false)) {
                errors.email = 'Email format is invalid'
            } else if ((email ?? '')?.length > 40) {
                errors.email = 'Email must be at most 40 characters'
            }
        }

        // * Determine overall validation status
        const isValid = Object?.keys?.(errors ?? {})?.length === 0

        // * Return validation result with sanitized payload
        return {
            isValid: isValid ?? false,
            errors: errors ?? {},
            cleaned: {
                ...(name !== undefined ? { name: name ?? '' } : {}),
                ...(email !== undefined ? { email: email ?? '' } : {}),
            },
        }
    } catch (error) {
        // * Fallback response for unexpected validation failures
        return {
            isValid: false,
            errors: { general: 'Validation failed' },
            cleaned: {},
        }
    }
}
//endregion Update Profile Body Validator

//region Change Password Body Validator
// * validateChangePasswordBody Function
// * Validates password change request payload
// * Ensures current password exists
// * Enforces strong password rules for new password
// * Confirms new password match
const validateChangePasswordBody = (req = {}) => {
    try {
        // * Safely extract request body
        const body = req?.body ?? {}

        // * Sanitize incoming password fields
        const currentPassword = trimString(body?.currentPassword ?? '')
        const newPassword = trimString(body?.newPassword ?? '')
        const confirmNewPassword = trimString(body?.confirmNewPassword ?? '')

        // * Object to accumulate validation errors
        const errors = {}

        // * Current password must be present
        if (!currentPassword) {
            errors.currentPassword = 'Current password is required'
        }

        // * New password must meet security requirements
        if (!newPassword) {
            errors.newPassword = 'New password is required'
        } else if (!(REGEX?.PASSWORD?.test?.(newPassword ?? '') ?? false)) {
            errors.newPassword =
                'Password must contain uppercase, lowercase, number, special character and length 8-32'
        }

        // * Confirm password must match new password
        if (!confirmNewPassword) {
            errors.confirmNewPassword = 'Confirm new password is required'
        } else if ((confirmNewPassword ?? '') !== (newPassword ?? '')) {
            errors.confirmNewPassword = 'Passwords do not match'
        }

        // * Determine overall validation status
        const isValid = Object?.keys?.(errors ?? {})?.length === 0

        // * Return validation result with sanitized payload
        return {
            isValid: isValid ?? false,
            errors: errors ?? {},
            cleaned: {
                currentPassword: currentPassword ?? '',
                newPassword: newPassword ?? '',
                confirmNewPassword: confirmNewPassword ?? '',
            },
        }
    } catch (error) {
        // * Fallback response for unexpected validation failures
        return {
            isValid: false,
            errors: { general: 'Validation failed' },
            cleaned: {},
        }
    }
}
//endregion Change Password Body Validator

//region Export
// * Exporting validators for controller-level usage
export { validateUpdateProfileBody, validateChangePasswordBody }
//endregion Export
