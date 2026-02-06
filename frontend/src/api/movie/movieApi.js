//region Imports
import { apiRequest } from '../../utils/apiHelpers.js'
//endregion Imports

//region Get Movies API
const getMoviesApi = async ({ search = '', language = '', genres = [], page = 1,
    limit = 12, } = {}) => {
    try {
        return await apiRequest?.({
            path: '/movies',
            method: 'GET',
            params: {
                ...(search ? { search: search ?? '' } : {}),
                ...(language ? { language: language ?? '' } : {}),
                ...(Array?.isArray?.(genres) && (genres ?? [])?.length > 0
                    ? { genres: (genres ?? [])?.join?.(',') ?? '' }
                    : {}),
                page,
                limit,
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Get Movies API

//region Get Movie By ID API
const getMovieByIdApi = async ({ movieId = '' } = {}) => {
    try {
        return await apiRequest?.({
            path: `/movies/${movieId ?? ''}`,
            method: 'GET',
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Get Movie By ID API

//region Create Movie API (Admin)
const createMovieApi = async ({ title = '', language = '', genres = [], releaseYear = null } = {}) => {
    try {
        return await apiRequest?.({
            path: '/movies',
            method: 'POST',
            body: {
                title: title ?? '',
                language: language ?? '',
                genres: genres ?? [],
                releaseYear: releaseYear ?? null,
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Create Movie API (Admin)

//region Update Movie API (Admin)
const updateMovieApi = async ({ movieId = '', title, language, genres, releaseYear } = {}) => {
    try {
        return await apiRequest?.({
            path: `/movies/${movieId ?? ''}`,
            method: 'PUT',
            body: {
                ...(title !== undefined ? { title: title ?? '' } : {}),
                ...(language !== undefined ? { language: language ?? '' } : {}),
                ...(genres !== undefined ? { genres: genres ?? [] } : {}),
                ...(releaseYear !== undefined ? { releaseYear: releaseYear ?? null } : {}),
            },
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Update Movie API (Admin)

//region Delete Movie API (Admin)
const deleteMovieApi = async ({ movieId = '' } = {}) => {
    try {
        return await apiRequest?.({
            path: `/movies/${movieId ?? ''}`,
            method: 'DELETE',
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Delete Movie API (Admin)

//region Admin Stats API
const getAdminStatsApi = async () => {
    try {
        return await apiRequest?.({
            path: '/movies/admin/stats',
            method: 'GET',
        })
    } catch (error) {
        return { ok: false, status: 0, data: {} }
    }
}
//endregion Admin Stats API

//region Export
export { getMoviesApi, getMovieByIdApi, createMovieApi, updateMovieApi, deleteMovieApi, getAdminStatsApi }
//endregion Export
