//region Imports
import argon2 from 'argon2'

import { UserModel } from '../../models/user/userModel.js'
import { formatToIST, toLowerTrim, trimString } from '../../utils/commonFunctions.js'
//endregion Imports

//region Get Me Query
// * getUserQuery Function
// * Retrieves a specific user's profile details from the database by their unique ID.
// * Excludes sensitive fields like hashed passwords for security.
const getUserQuery = async ({ userId = '' } = {}) => {
    try {
        const user = await UserModel?.findOne?.({
            'User-Id': userId ?? '',
            'Is-Deleted': 0,
        })
            ?.select?.('User-Id Name Email-Address Role Created-At Updated-At')
            ?.lean?.()

        return user ?? null
    } catch (error) {
        // * Returns null to signify user not found or database error
        return null
    }
}
//endregion Get Me Query

//region Update Profile Query
// * updateUserProfileQuery Function
// * Updates non-sensitive user information such as name and email.
// * Dynamically builds the update object based on provided arguments.
const updateUserProfileQuery = async ({ userId = '', name, email } = {}) => {
    try {
        const update = {}

        // * Only add fields to the update object if they are explicitly provided
        if (name !== undefined) update.Name = trimString(name ?? '')
        if (email !== undefined) update['Email-Address'] = toLowerTrim(email ?? '')

        // * Always refresh the Updated-At timestamp on modification
        update['Updated-At'] = () => formatToIST?.({}) ?? new Date()

        const updated = await UserModel?.findOneAndUpdate?.(
            { 'User-Id': userId ?? '', 'Is-Deleted': 0 },
            { $set: update },
            { new: true }
        )
            ?.select?.('User-Id Name Email-Address Role Created-At Updated-At')
            ?.lean?.()

        return updated ?? null
    } catch (error) {
        return null
    }
}
//endregion Update Profile Query

//region Change Password Query
// * changePasswordQuery Function
// * Handles the secure process of updating a user's password.
// * Requires verification of the current password using Argon2 before allowing the change.
const changePasswordQuery = async ({ userId = '', currentPassword = '', newPassword = '' } = {}) => {
    try {
        const user = await UserModel?.findOne?.({
            'User-Id': userId ?? '',
            'Is-Deleted': 0,
        })

        if (!user?.['User-Id']) {
            return { ok: false, message: 'User not found' }
        }

        // * Verify the provided current password against the stored hash
        const isMatch = await argon2?.verify?.(user?.['Hashed-Password'] ?? '', currentPassword ?? '')

        if (!isMatch) {
            return { ok: false, message: 'Current password is incorrect' }
        }

        // * Hash the new password before saving it to the database
        const newHash = await argon2?.hash?.(newPassword ?? '')

        user['Hashed-Password'] = newHash ?? ''
        user['Updated-At'] = () => formatToIST?.({}) ?? new Date()

        await user?.save?.()

        return { ok: true, message: 'Password updated successfully' }
    } catch (error) {
        return { ok: false, message: 'Password update failed' }
    }
}
//endregion Change Password Query

//region Export
export { getUserQuery, updateUserProfileQuery, changePasswordQuery }
//endregion Export
