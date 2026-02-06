//region Imports

// * Promise-based HTTP client for making API requests
import axios from 'axios'
// * Environment configuration and variable management
import { env } from '../config/env/env.js'

//endregion Imports


//region Base URL
const API_BASE_URL = env?.API_BASE_URL ?? 'http://localhost:5000/api'
//endregion Base URL

//region Axios Instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 15000,
})
//endregion Axios Instance

//region API Request Helper (Axios wrapper)
const apiRequest = async ({
    path = '',
    method = 'GET',
    body = undefined,
    params = undefined,
    headers = {},
} = {}) => {
    try {
        const res = await apiClient.request({
            url: path,
            method,
            data: body !== undefined ? body : undefined,
            params: params !== undefined ? params : undefined,
            headers: {
                ...(headers ?? {}),
            },
        })

        return {
            ok: true,
            status: res?.statusCode ?? 200,
            data: res?.data ?? {},
            message: res?.data?.message ?? '',
            unauthorized: false,
            forbidden: false,
            badRequest: false,
            serverError: false,
        }
    } catch (error) {
        const status = error?.response?.status ?? 0

        // Default error payload
        const data =
            error?.response?.data ?? {
                statusCode: status || 400,
                status: 'FAILED',
                message:
                    error?.code === 'ECONNABORTED'
                        ? 'Request timeout'
                        : 'Network error',
                response: {},
            }

        return {
            ok: false,
            status,
            data,
            message: data?.message ?? 'Something went wrong',
            unauthorized: status === 401,
            forbidden: status === 403,
            badRequest: status === 400,
            serverError: status >= 500,
            networkError: status === 0,
        }
    }
}
//endregion API Request Helper (Axios wrapper)

export { apiRequest }
