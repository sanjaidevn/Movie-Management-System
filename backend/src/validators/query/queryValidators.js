//region Imports
import { trimString, safeArray } from '../../utils/commonFunctions.js'
//endregion Imports

//region Movie Query Filters Validator
const validateMovieQueryFilters = (req) => {
    try {
        const query = req?.query ?? {}

        const language = trimString(query?.language ?? '')

        const search = trimString(query?.search ?? '')

        // genres can come as "Action,Drama" or ["Action","Drama"]
        let genres = []

        if (typeof query?.genres === 'string') {
            genres =
                (query?.genres ?? '')
                    ?.split?.(',')
                    ?.map?.((x) => trimString(x ?? ''))
                    ?.filter?.((x) => Boolean(x)) ?? []
        } else if (Array.isArray(query?.genres)) {
            genres = safeArray(query?.genres ?? [])
                ?.map?.((x) => trimString(x ?? ''))
                ?.filter?.((x) => Boolean(x))
        }
        // Pagination (IMPORTANT)
        const page = Number(query?.page)
        const limit = Number(query?.limit)
        // return cleaned Query params
        return {
            isValid: true,
            errors: {},
            cleanedQuery: {
                search: search ?? '',
                language: language ?? '',
                genres: genres ?? [],
                page: Number.isInteger(page) && page > 0 ? page : 1,
                limit: Number.isInteger(limit) && limit > 0 ? limit : 10,
            },
        }
    } catch (error) {
        return {
            isValid: false,
            errors: { general: 'Query validation failed' },
            cleanedQuery: {
                search: '',
                language: '',
                genres: [],
                page: 1,
                limit: 10,
            },
        }
    }
}
//endregion Movie Query Filters Validator

//region Export
export { validateMovieQueryFilters }
//endregion Export
