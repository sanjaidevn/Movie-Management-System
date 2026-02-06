//region Imports
import { apiRequest } from '../../utils/apiHelpers.js'
//endregion Imports

//region Register API (User)
const registerApi = async ({ name = '', email = '', password = '', confirmPassword = '', role = 'user' } = {}) => {
    try {
        return await apiRequest?.({
            path: '/auth/register',
            method: 'POST',
            body: {
                name: name ?? '',
                email: email ?? '',
                password: password ?? '',
                confirmPassword: confirmPassword ?? '',
                role: role ?? 'user',
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {}, unauthorized: false }
    }
}
//endregion Register API (User)

//region Register API (Admin)
const adminRegisterApi = async ({ name = '', email = '', password = '', confirmPassword = '' } = {}) => {
    try {
        return await apiRequest?.({
            path: '/auth/admin/register',
            method: 'POST',
            body: {
                name: name ?? '',
                email: email ?? '',
                password: password ?? '',
                confirmPassword: confirmPassword ?? '',
                role: 'admin',
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {}, unauthorized: false }
    }
}
//endregion Register API (Admin)

//region Login API (User)
const loginApi = async ({ email = '', password = '' } = {}) => {
    try {
        return await apiRequest?.({
            path: '/auth/login',
            method: 'POST',
            body: {
                email: email ?? '',
                password: password ?? '',
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {}, unauthorized: false }
    }
}
//endregion Login API (User)

//region Login API (Admin)
const adminLoginApi = async ({ email = '', password = '' } = {}) => {
    try {
        return await apiRequest?.({
            path: '/auth/login',
            method: 'POST',
            body: {
                email: email ?? '',
                password: password ?? '',
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {}, unauthorized: false }
    }
}
//endregion Login API (Admin)

//region Logout API
const logoutApi = async () => {
    try {
        return await apiRequest?.({
            path: '/auth/logout',
            method: 'POST',
        })
    } catch (error) {
        return { ok: false, status: 0, data: {}, unauthorized: false }
    }
}
//endregion Logout API

//region Export
export { registerApi, adminRegisterApi, loginApi, adminLoginApi, logoutApi }
//endregion Export
