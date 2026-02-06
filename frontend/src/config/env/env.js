//region Env Loader (JSON from .env)
const loadEnv = () => {
    try {
        // * Getting the ENV
        const raw = import.meta?.env?.VITE_APP_ENV ?? '{}'
        // * Parsing the ENV
        const parsed = JSON?.parse?.(raw ?? '{}') ?? {}
        // * returning ENV
        return parsed;
    } catch (error) {
        console.error("Env Parsing Failed");
        return {}
    }
}

const env = loadEnv?.()
//endregion Env Loader (JSON from .env)

// region Export ENV
export { env }
// endregion