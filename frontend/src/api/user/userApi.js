//region Imports
import { apiRequest } from '../../utils/apiHelpers.js'
//endregion Imports

//region Get Profile API
const getMeApi = async () => {
    try {
        return await apiRequest?.({
            path: '/users/me',
            method: 'GET',
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Get Profile API

//region Update Profile API
const updateMeApi = async ({ name, email } = {}) => {
    try {
        return await apiRequest?.({
            path: '/users/me',
            method: 'PUT',
            body: {
                ...(name !== undefined ? { name: name ?? '' } : {}),
                ...(email !== undefined ? { email: email ?? '' } : {}),
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Update Profile API

//region Change Password API
const changePasswordApi = async ({ currentPassword = '', newPassword = '', confirmNewPassword = '' } = {}) => {
    try {
        return await apiRequest?.({
            path: '/users/me/change-password',
            method: 'PUT',
            body: {
                currentPassword: currentPassword ?? '',
                newPassword: newPassword ?? '',
                confirmNewPassword: confirmNewPassword ?? '',
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Change Password API

//region Export
export { getMeApi, updateMeApi, changePasswordApi }
//endregion Export
